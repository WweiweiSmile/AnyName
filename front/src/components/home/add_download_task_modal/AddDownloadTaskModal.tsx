import {Form, Input, Modal} from 'antd';
import {useForm} from 'antd/es/form/Form';

type DownloadTask = {
  url: string;
  fileName: string;
}

type AddDownloadTaskModalProps = {
  open: boolean;
  onOk?: (value: DownloadTask) => void;
  onCancel?: () => void;
}
const AddDownloadTaskModal: React.FC<AddDownloadTaskModalProps> = (props) => {
  const [form] = useForm<DownloadTask>();
  const {open, onOk, onCancel} = props;

  const modalOnOk = () => {
    form.validateFields().then(values => onOk?.(values)).catch(() => {});
  };

  return <Modal open={open} onOk={modalOnOk} onCancel={onCancel}>
    <Form form={form}>
      <Form.Item label="下载地址" name="url" rules={[{required: true, message: '请输入下载地址'}]}><Input/></Form.Item>
      <Form.Item label="文件名称" name="fileName"><Input/></Form.Item>
    </Form>
  </Modal>;
};

export default AddDownloadTaskModal;