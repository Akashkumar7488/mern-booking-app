import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

type EnterOtpFormData = {
  otp: string;
  newPassword: string;
};

const EnterOtp = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm<EnterOtpFormData>();

  const mutation = useMutation(apiClient.verifyOtpAndResetPassword, {
    onSuccess: () => {
      showToast({ message: "Password reset successfully", type: "Success" });
      navigate("/sign-in");
    },
    onError: (error: any) => {
      showToast({ message: (error as Error).message, type: "Error" });
    }
  });

  const onSubmit = handleSubmit((data: EnterOtpFormData) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Enter OTP</h2>
      <label className="text-gray-700 text-sm font-bold">
        OTP:
        <input type="text" className="border rounded w-full py-1 px-2" {...register("otp", { required: "This field is required" })} />
        {errors.otp && <span className="text-red-500">{errors.otp.message as string}</span>}
      </label>
      <label className="text-gray-700 text-sm font-bold">
        New Password:
        <input type="password" className="border rounded w-full py-1 px-2" {...register("newPassword", { required: "This field is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
        {errors.newPassword && <span className="text-red-500">{errors.newPassword.message as string}</span>}
      </label>
      <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500">Reset Password</button>
    </form>
  );
};

export default EnterOtp;
