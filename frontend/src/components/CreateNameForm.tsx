import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { NameCreateInputs } from '@/types';
import { AntdIconButton } from '@/components/AntdIconButton';
import { ArrowRightOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Alert } from 'antd';
import { createUser } from '@/utils/userFunctions';
import { showSuccessNotification, showErrorNotification } from '@/utils/notificationFunctions';
import { User } from '@/types';

interface Props {
  setCurrentUser: (user: User | null) => void;
}

export function CreateNameForm({ setCurrentUser }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<NameCreateInputs>();

  const onSubmit: SubmitHandler<NameCreateInputs> = (data) => {
    //Attempt to create the user in LocalStorage
    try {
      const user = createUser(data.name);

      if (!user) {
        throw new Error('Failed to create user');
      }

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User data not found in localStorage');
      }

      const parsedUser = JSON.parse(storedUser) as User;

      setCurrentUser(parsedUser);

      //Show success notification if user is created
      showSuccessNotification({
        messageTitle: `User ${user.name} created success!`,
        description: 'You are now ready to chat!',
        placement: 'topRight'
      });
    } catch (error) {
      // Show error if user is not created
      console.error('Error in onSubmit:', error);
      showErrorNotification({
        messageTitle: 'Error creating user',
        description: 'Uh oh, something went wrong. Please try again.',
        placement: 'bottomRight'
      });
    }
  };

  return (
    <form className="flex flex-col gap-y-6 w-[20rem]" onSubmit={handleSubmit(onSubmit)}>
      {/* include validation with required or other standard HTML validation rules */}
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            size="large"
            placeholder="Sir Chatalot"
            prefix={<UserOutlined />}
            {...field} // This correctly binds React Hook Form to Ant Design's Input
          />
        )}
      />
      {/* errors will return when field validation fails  */}
      {errors.name && <Alert message="Your name is required to use WaveChat!" type="error" />}

      <AntdIconButton position="end" icon={<ArrowRightOutlined />} type="submit" onClick={() => {}}>
        Get Chatting
      </AntdIconButton>
    </form>
  );
}
