import { notification } from "antd";

interface NotificationContextProps {
    messageTitle: string;
    description: string;
    placement?: "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight";
}

export function showSuccessNotification({ messageTitle, description, placement }: NotificationContextProps) {
    notification.success({
        message: messageTitle,
        description: description,
        placement: placement,
    });
}

export function showErrorNotification({ messageTitle, description, placement }: NotificationContextProps) {
    notification.error({
        message: messageTitle,
        description: description,
        placement: placement,
    });
}