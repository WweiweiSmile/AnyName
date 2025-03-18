import React from 'react';
import {Button, Popconfirm} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';

type DeleteConfirmProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
  title?: string;
  description?: string;
};

const DeleteConfirm: React.FC<DeleteConfirmProps> = (props) => {
  const {onCancel, onConfirm, children, title, description} = props;
  return (
    <Popconfirm
      title={title || '删除文件'}
      description={description || '你确认删除这个文件吗？'}
      icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
    >
      {children ? children : <Button danger>Delete</Button>}
    </Popconfirm>
  );
};

export default DeleteConfirm;