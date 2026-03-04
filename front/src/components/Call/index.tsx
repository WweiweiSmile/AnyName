import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Input, message, Modal} from 'antd';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';

// ==================== 常量定义 ====================
const MAX_SEATS = 9;
const STORAGE_KEY_PREFIX = 'participant_position_';
const STORAGE_KEY_ALL_USERS = 'all_users';
const END_GAME_CONFIRM_TEXT = '结束比赛';
const QUICK_AMOUNTS = [1000, 2000, 5000, 10000];

// ==================== 类型定义 ====================
interface Participant {
  id: string;
  name: string;
  totalBorrowed: number; // 累计取分总额
  totalSaved: number;    // 累计存分总额
}

interface SettlementResult {
  success: boolean;
  difference?: number;
}

// ==================== 工具函数 ====================
const parseJSON = (data: string | null, fallback: any): any => {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

const calculateNet = (participant: Participant) => {
  return participant.totalSaved - participant.totalBorrowed;
};

// ==================== 组件 ====================
const Call: React.FC = () => {
  // ==================== 状态声明（按功能分组） ====================
  // 参与者数据
  const [participants, setParticipants] = useState<(Participant | null)[]>(
    Array(MAX_SEATS).fill(null)
  );
  const [allUsers, setAllUsers] = useState<Participant[]>([]);

  // 模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [isEndGameModalVisible, setIsEndGameModalVisible] = useState(false);
  const [isSettlementModalVisible, setIsSettlementModalVisible] = useState(false);

  // 表单数据
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [selectedUser, setSelectedUser] = useState<Participant | null>(null);
  const [endGameConfirmText, setEndGameConfirmText] = useState('');
  const [settlementResult, setSettlementResult] = useState<SettlementResult | null>(null);

  // 存取分操作状态（分开存储，避免冲突）
  const [isCustomSaveSelected, setIsCustomSaveSelected] = useState(false);
  const [customSaveAmount, setCustomSaveAmount] = useState('');
  const [isCustomWithdrawSelected, setIsCustomWithdrawSelected] = useState(false);
  const [customWithdrawAmount, setCustomWithdrawAmount] = useState('');

  // UI 布局状态
  const [containerSize, setContainerSize] = useState({width: 400, height: 400});

  // ==================== 数据持久化 ====================
  useEffect(() => {
    // 恢复圆桌上的用户数据
    const savedParticipants: (Participant | null)[] = Array(MAX_SEATS).fill(null);
    for (let i = 0; i < MAX_SEATS; i++) {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${i}`);
      savedParticipants[i] = parseJSON(data, null);
    }
    setParticipants(savedParticipants);

    // 恢复已下桌的用户数据
    const savedAllUsers = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    setAllUsers(parseJSON(savedAllUsers, []));
  }, []);

  // 保存参与者到 localStorage
  const saveParticipantToStorage = useCallback((index: number, participant: Participant | null) => {
    if (participant) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${index}`, JSON.stringify(participant));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${index}`);
    }
  }, []);

  // 保存所有用户到 localStorage
  const saveAllUsersToStorage = useCallback((users: Participant[]) => {
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
  }, []);

  // ==================== 容器尺寸计算 ====================
  const updateContainerSize = useCallback(() => {
    const circleContainer = document.querySelector('.circle-container');
    if (circleContainer) {
      const rect = circleContainer.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      setContainerSize({width: size, height: size});
    }
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  // ==================== 位置计算 ====================
  const getPositionStyle = useCallback((index: number) => {
    const containerWidth = Math.min(containerSize.width, window.innerWidth - 32);
    const tableRadius = Math.min(containerWidth * 0.5, containerSize.height * 0.5, 200);
    const seatButtonRadius = window.innerWidth < 640 ? 28 : 32;
    const radius = tableRadius - seatButtonRadius;
    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;
    const angle = (index * (360 / MAX_SEATS) - 90) * (Math.PI / 180);

    return {
      left: `${centerX + radius * Math.cos(angle)}px`,
      top: `${centerY + radius * Math.sin(angle)}px`,
    };
  }, [containerSize]);

  // ==================== 排行榜数据（useMemo 缓存） ====================
  const leaderboardData = useMemo(() => {
    const allParticipants = [
      ...allUsers,
      ...participants.filter((p): p is Participant => p !== null)
    ];

    // 按用户名去重，保留最新数据
    const uniqueMap = new Map<string, Participant>();
    allParticipants.forEach(p => {
      const existing = uniqueMap.get(p.name);
      if (!existing || p.totalBorrowed + p.totalSaved > existing.totalBorrowed + existing.totalSaved) {
        uniqueMap.set(p.name, p);
      }
    });

    return Array.from(uniqueMap.values())
      .sort((a, b) => calculateNet(b) - calculateNet(a))
      .slice(0, 10);
  }, [allUsers, participants]);

  // ==================== 参与者操作 ====================
  const showModal = useCallback((position: number) => {
    setCurrentPosition(position);
    setIsModalVisible(true);
  }, []);

  const handleOk = useCallback(() => {
    const trimmedName = userName.trim();
    if (!trimmedName) {
      message.warning('请输入用户名');
      return;
    }

    if (currentPosition === null) return;

    // 检查是否已有同名用户的历史数据
    const existingUser = allUsers.find(user => user.name === trimmedName);

    const newUser: Participant = existingUser
      ? {...existingUser, id: Date.now().toString()}
      : {
        id: Date.now().toString(),
        name: trimmedName,
        totalBorrowed: 0,
        totalSaved: 0
      };

    const newParticipants = [...participants];
    newParticipants[currentPosition] = newUser;
    setParticipants(newParticipants);
    saveParticipantToStorage(currentPosition, newUser);

    // 如果是历史用户，从已下桌列表中移除
    if (existingUser) {
      const updatedAllUsers = allUsers.filter(user => user.name !== trimmedName);
      setAllUsers(updatedAllUsers);
      saveAllUsersToStorage(updatedAllUsers);
      message.success(`欢迎回来，${trimmedName}！已恢复您的历史数据`);
    } else {
      message.success('添加成功');
    }

    setIsModalVisible(false);
    setUserName('');
    setCurrentPosition(null);
  }, [userName, currentPosition, allUsers, participants, saveParticipantToStorage, saveAllUsersToStorage]);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setUserName('');
    setCurrentPosition(null);
  }, []);

  const removeParticipant = useCallback((index: number) => {
    const newParticipants = [...participants];
    const removedUser = newParticipants[index];

    if (removedUser) {
      const updatedAllUsers = [...allUsers];
      const existingUserIndex = updatedAllUsers.findIndex(user => user.name === removedUser.name);

      if (existingUserIndex !== -1) {
        // 如果用户已存在，更新数据（累加历史数据）
        updatedAllUsers[existingUserIndex] = {
          ...removedUser,
          totalBorrowed: updatedAllUsers[existingUserIndex].totalBorrowed + removedUser.totalBorrowed,
          totalSaved: updatedAllUsers[existingUserIndex].totalSaved + removedUser.totalSaved
        };
      } else {
        updatedAllUsers.push(removedUser);
      }

      setAllUsers(updatedAllUsers);
      saveAllUsersToStorage(updatedAllUsers);
    }

    newParticipants[index] = null;
    setParticipants(newParticipants);
    saveParticipantToStorage(index, null);

    message.success(`${removedUser?.name || '用户'}已下桌，数据已保存`);
  }, [participants, allUsers, saveParticipantToStorage, saveAllUsersToStorage]);

  // ==================== 存取分操作（提取通用逻辑） ====================
  const updateParticipantPoints = useCallback((
    type: 'save' | 'withdraw',
    amount: number
  ) => {
    if (!selectedUser) return;

    const newParticipants = [...participants];
    const index = participants.findIndex(p => p?.id === selectedUser.id);
    if (index === -1 || !newParticipants[index]) return;

    const updated = {
      ...newParticipants[index]!,
      ...(type === 'save'
          ? {totalSaved: newParticipants[index]!.totalSaved + amount}
          : {totalBorrowed: newParticipants[index]!.totalBorrowed + amount}
      )
    };

    newParticipants[index] = updated;
    setParticipants([...newParticipants]);
    saveParticipantToStorage(index, updated);
    setSelectedUser({...updated});

    const actionText = type === 'save' ? '存入' : '取出';
    message.success(`${actionText} ${amount} 积分成功`);
  }, [selectedUser, participants, saveParticipantToStorage]);

  const saveChips = useCallback((amount: number) => {
    updateParticipantPoints('save', amount);
  }, [updateParticipantPoints]);

  const withdrawChips = useCallback((amount: number) => {
    updateParticipantPoints('withdraw', amount);
  }, [updateParticipantPoints]);

  const saveCustomChips = useCallback(() => {
    const amount = parseInt(customSaveAmount);
    if (isNaN(amount) || amount <= 0) {
      message.warning('请输入有效的存分数量');
      return;
    }
    if (!isCustomSaveSelected) {
      message.warning('请先选择"其他"选项');
      return;
    }

    saveChips(amount);
    setCustomSaveAmount('');
    setIsCustomSaveSelected(false);
  }, [customSaveAmount, isCustomSaveSelected, saveChips]);

  const withdrawCustomChips = useCallback(() => {
    const amount = parseInt(customWithdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      message.warning('请输入有效的取分数量');
      return;
    }
    if (!isCustomWithdrawSelected) {
      message.warning('请先选择"其他"选项');
      return;
    }

    withdrawChips(amount);
    setCustomWithdrawAmount('');
    setIsCustomWithdrawSelected(false);
  }, [customWithdrawAmount, isCustomWithdrawSelected, withdrawChips]);

  // ==================== 操作模态框 ====================
  const showActionModal = useCallback((participant: Participant) => {
    setSelectedUser(participant);
    setIsActionModalVisible(true);
    setIsCustomSaveSelected(false);
    setCustomSaveAmount('');
    setIsCustomWithdrawSelected(false);
    setCustomWithdrawAmount('');
  }, []);

  const handleActionModalOk = useCallback(() => {
    setIsActionModalVisible(false);
    setSelectedUser(null);
  }, []);

  const handleActionModalCancel = useCallback(() => {
    setIsActionModalVisible(false);
    setSelectedUser(null);
    setIsCustomSaveSelected(false);
    setCustomSaveAmount('');
    setIsCustomWithdrawSelected(false);
    setCustomWithdrawAmount('');
  }, []);

  // ==================== 排行榜 ====================
  const toggleLeaderboard = useCallback(() => {
    setIsLeaderboardVisible(prev => !prev);
  }, []);

  // ==================== 结束比赛 ====================
  const showEndGameModal = useCallback(() => {
    setIsEndGameModalVisible(true);
    setEndGameConfirmText('');
  }, []);

  const handleEndGameConfirm = useCallback(() => {
    if (endGameConfirmText !== END_GAME_CONFIRM_TEXT) {
      message.warning(`请输入正确的确认文字：${END_GAME_CONFIRM_TEXT}`);
      return;
    }

    setParticipants(Array(MAX_SEATS).fill(null));
    setAllUsers([]);

    for (let i = 0; i < MAX_SEATS; i++) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${i}`);
    }
    localStorage.removeItem(STORAGE_KEY_ALL_USERS);

    setIsEndGameModalVisible(false);
    setEndGameConfirmText('');
    message.success('比赛已结束，所有数据已清除');
  }, [endGameConfirmText]);

  const handleEndGameCancel = useCallback(() => {
    setIsEndGameModalVisible(false);
    setEndGameConfirmText('');
  }, []);

  // ==================== 结算 ====================
  const showSettlement = useCallback(() => {
    const currentParticipants = participants.filter((p): p is Participant => p !== null);
    const totalNet = currentParticipants.reduce((sum, p) => sum + calculateNet(p), 0);

    const result: SettlementResult = totalNet === 0
      ? {success: true}
      : {success: false, difference: totalNet};

    setSettlementResult(result);
    setIsSettlementModalVisible(true);

    if (result.success) {
      message.success('结算成功！所有人员净积分总和为 0');
    } else {
      message.warning(`结算失败：净积分总和不等于 0，相差 ${Math.abs(totalNet)}`);
    }
  }, [participants]);

  const handleSettlementCancel = useCallback(() => {
    setIsSettlementModalVisible(false);
    setSettlementResult(null);
  }, []);

  // ==================== 渲染 ====================
  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-4 flex flex-col">
      {/* 排行榜 - 移动端全屏覆盖 */}
      {isLeaderboardVisible && (
        <div
          className="fixed inset-0 bg-white z-50 md:relative md:w-80 md:rounded-lg md:shadow-lg md:p-6 md:h-fit md:mr-4 md:overflow-y-auto">
          <div className="flex justify-between items-center p-4 md:p-0 md:mb-4 border-b md:border-b-0">
            <h2 className="text-xl font-bold text-gray-800">积分排行榜</h2>
            <Button
              type="text"
              icon={<CloseOutlined/>}
              onClick={toggleLeaderboard}
              className="md:hidden"
            />
          </div>
          <div className="p-4 md:p-0 md:space-y-3 max-h-[calc(100vh-80px)] md:max-h-none overflow-y-auto">
            {leaderboardData.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 border-2 border-yellow-300' :
                    index === 1 ? 'bg-gray-100 border-2 border-gray-300' :
                      index === 2 ? 'bg-orange-100 border-2 border-orange-300' :
                        'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                            'bg-blue-500 text-white'
                    }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500">
                      取:{user.totalBorrowed} 存:{user.totalSaved}
                    </div>
                  </div>
                </div>
                <div
                  className={`font-bold ${calculateNet(user) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateNet(user)}
                </div>
              </div>
            ))}

            {leaderboardData.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                暂无排行榜数据
              </div>
            )}
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col items-center justify-start w-full pt-4">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 sm:mb-6 px-2">
          <div className="text-2xl font-bold text-gray-800">圆桌会议</div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="primary"
              onClick={showSettlement}
              className="flex-1 sm:flex-none"
            >
              结算
            </Button>
            <Button
              type="primary"
              danger
              onClick={showEndGameModal}
              className="flex-1 sm:flex-none"
            >
              结束比赛
            </Button>
          </div>
        </div>

        {/* 圆形容器 */}
        <div
          className="relative mx-auto my-6 circle-container w-full max-w-[90vw] md:max-w-[400px] aspect-square px-4"
          style={{maxWidth: 'min(90vw, 400px)'}}>
          {/* 圆形背景 */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 bg-blue-50 overflow-hidden"
               style={{width: '100%', height: '100%'}}></div>

          {/* 圆桌中央的排行榜按钮 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              type="primary"
              shape="circle"
              size="large"
              onClick={toggleLeaderboard}
              className="z-10 shadow-lg hover:scale-110 transition-transform duration-200"
            >
              🏆
            </Button>
          </div>

          {/* {MAX_SEATS}个位置 */}
          {participants.map((participant, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={getPositionStyle(index)}
            >
              {participant ? (
                // 已有人的位置
                <div className="relative group" style={{zIndex: 10}}>
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() => showActionModal(participant)}
                  >
                    <span className="text-white font-bold text-xs md:text-sm">
                      {participant.name.substring(0, 2)}
                    </span>
                  </div>
                  <div
                    className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap"
                    style={{zIndex: 20}}>
                    💰{calculateNet(participant)}
                  </div>
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{zIndex: 30}}>
                    {participant.name}
                  </div>
                  <button
                    onClick={() => removeParticipant(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-200 shadow-md"
                    style={{zIndex: 40}}>
                    <CloseOutlined className="text-xs"/>
                  </button>
                </div>
              ) : (
                // 空位置，显示 + 号
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined/>}
                  size="large"
                  className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
                  onClick={() => showModal(index)}
                  style={{zIndex: 10}}
                />
              )}
            </div>
          ))}
        </div>

        {/* 添加人员模态框 */}
        <Modal
          title="添加参会人员"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确定"
          cancelText="取消"
          width="90%"
          className="mobile-modal"
        >
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <Input
              placeholder="请输入用户名"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onPressEnter={handleOk}
              autoFocus
              size="large"
            />
          </div>
        </Modal>

        {/* 存取分操作模态框 */}
        <Modal
          title={`操作 - ${selectedUser?.name}`}
          open={isActionModalVisible}
          onOk={handleActionModalOk}
          onCancel={handleActionModalCancel}
          okText="关闭"
          cancelText="取消"
          footer={null}
          width="90%"
          className="mobile-modal"
        >
          <div className="py-4">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-center space-y-2">
                <div
                  className="text-base md:text-lg font-bold text-blue-800">累计取分: {selectedUser?.totalBorrowed ?? 0}</div>
                <div
                  className="text-base md:text-lg font-bold text-green-800">累计存分: {selectedUser?.totalSaved ?? 0}</div>
                <div
                  className="text-base md:text-lg font-bold text-purple-800">净积分: {selectedUser ? calculateNet(selectedUser) : 0}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">存分</h3>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {QUICK_AMOUNTS.map(amount => (
                  <Button
                    key={amount}
                    type="primary"
                    onClick={() => saveChips(amount)}
                    size="large"
                    className="touch-manipulation"
                  >
                    +{amount}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <Button
                  type={isCustomSaveSelected ? "primary" : "default"}
                  onClick={() => setIsCustomSaveSelected(!isCustomSaveSelected)}
                  size="large"
                  className="w-full sm:w-auto touch-manipulation"
                >
                  其他
                </Button>
                <Input
                  placeholder="输入自定义存分金额"
                  value={customSaveAmount}
                  onChange={(e) => setCustomSaveAmount(e.target.value)}
                  type="number"
                  className="flex-1 w-full"
                  disabled={!isCustomSaveSelected}
                  size="large"
                />
                <Button
                  type="primary"
                  onClick={saveCustomChips}
                  disabled={!isCustomSaveSelected}
                  size="large"
                  className="w-full sm:w-auto touch-manipulation"
                >
                  存入
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">取分</h3>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {QUICK_AMOUNTS.map(amount => (
                  <Button
                    key={amount}
                    type="primary"
                    onClick={() => withdrawChips(amount)}
                    size="large"
                    className="touch-manipulation"
                  >
                    +{amount}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <Button
                  type={isCustomWithdrawSelected ? "primary" : "default"}
                  onClick={() => setIsCustomWithdrawSelected(!isCustomWithdrawSelected)}
                  size="large"
                  className="w-full sm:w-auto touch-manipulation"
                >
                  其他
                </Button>
                <Input
                  placeholder="输入自定义取分金额"
                  value={customWithdrawAmount}
                  onChange={(e) => setCustomWithdrawAmount(e.target.value)}
                  type="number"
                  className="flex-1 w-full"
                  disabled={!isCustomWithdrawSelected}
                  size="large"
                />
                <Button
                  type="primary"
                  danger
                  onClick={withdrawCustomChips}
                  disabled={!isCustomWithdrawSelected}
                  size="large"
                  className="w-full sm:w-auto touch-manipulation"
                >
                  取出
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* 结束比赛确认模态框 */}
        <Modal
          title="⚠️ 确认结束比赛"
          open={isEndGameModalVisible}
          onOk={handleEndGameConfirm}
          onCancel={handleEndGameCancel}
          okText="确认结束"
          cancelText="取消"
          okButtonProps={{danger: true}}
          width="90%"
          className="mobile-modal"
        >
          <div className="py-4">
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-800 font-medium text-sm md:text-base">此操作将永久清除所有比赛数据，包括：</p>
              <ul className="text-red-700 mt-2 ml-4 list-disc text-sm">
                <li>圆桌上的所有用户数据</li>
                <li>已下桌用户的历史记录</li>
                <li>所有用户的取分和存分记录</li>
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请输入 "<span className="font-bold text-red-600">{END_GAME_CONFIRM_TEXT}</span>" 确认操作
              </label>
              <Input
                placeholder={END_GAME_CONFIRM_TEXT}
                value={endGameConfirmText}
                onChange={(e) => setEndGameConfirmText(e.target.value)}
                onPressEnter={handleEndGameConfirm}
                autoFocus
                size="large"
              />
            </div>

            <div className="text-sm text-gray-500">
              注意：此操作不可撤销，请谨慎操作。
            </div>
          </div>
        </Modal>

        {/* 结算结果模态框 */}
        <Modal
          title={settlementResult?.success ? "✅ 结算成功" : "⚠️ 结算结果"}
          open={isSettlementModalVisible}
          onOk={handleSettlementCancel}
          onCancel={handleSettlementCancel}
          okText="确定"
          footer={null}
          width="90%"
          className="mobile-modal"
        >
          <div className="py-6 text-center">
            {settlementResult?.success ? (
              <div className="space-y-4">
                <div className="text-6xl">🎉</div>
                <div className="text-xl font-bold text-green-600">
                  结算成功！
                </div>
                <div className="text-gray-600">
                  所有参会人员的净积分总和为 0
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">⚖️</div>
                <div className="text-xl font-bold text-orange-600">
                  结算不平衡
                </div>
                <div className="text-gray-700">
                  净积分总和：{settlementResult?.difference && settlementResult.difference > 0 ? '+' : ''}{settlementResult?.difference}
                </div>
                <div
                  className={`text-lg font-bold ${settlementResult?.difference && settlementResult.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  相差：{settlementResult?.difference ? Math.abs(settlementResult.difference) : 0}
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* 统计信息 */}
        <div className="mt-6 text-gray-600 text-center w-full px-2">
          参会人数: {participants.filter(p => p !== null).length}/{MAX_SEATS}
        </div>
      </div>
    </div>
  );
};

export default Call;
