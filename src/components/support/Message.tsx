import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";
import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

export interface UseMessageApiReturnType {
  showMessage: (type: NoticeType, content: string, duration?: number) => void;
  contextHolder: React.ReactElement;
}

const useMessageApi = (): UseMessageApiReturnType => {
  const [messageApi, contextHolder] = message.useMessage();
  const messageRef = useRef(messageApi);

  useEffect(() => {
    messageRef.current = messageApi;
  }, [messageApi]);

  const showMessage = (
    type: NoticeType,
    content: string,
    duration?: number
  ) => {
    messageRef.current.open({
      key: uuid(),
      type,
      content,
      duration,
    });
  };

  return { showMessage, contextHolder };
};

export default useMessageApi;
