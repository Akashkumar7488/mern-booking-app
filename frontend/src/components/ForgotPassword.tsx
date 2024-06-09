import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

 type ForgotFormData = {
  email: string;
  phoneNumber: string;
};

const ForgotPassword = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm<ForgotFormData>();

  const mutation = useMutation(apiClient.requestOtp, {
    onSuccess: () => {
      showToast({ message: "OTP sent successfully", type: "Success" });
      navigate("/enter-otp");
    },
    onError: (error: any) => {
      showToast({ message: error.message, type: "Error" });
    }
  });

  const onSubmit = handleSubmit((data: ForgotFormData) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Forgot Password</h2>
      <label className="text-gray-700 text-sm font-bold">
        Email:
        <input
          type="email"
          className="border rounded w-full py-1 px-2"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && <span className="text-red-500">{errors.email.message as string}</span>}
      </label>
      <label className="text-gray-700 text-sm font-bold">
        Phone Number:
        <input
          type="tel"
          className="border rounded w-full py-1 px-2"
          {...register("phoneNumber", { required: "This field is required" })}
        />
        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message as string}</span>}
      </label>
      <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500">
        Request OTP
      </button>
    </form>
  );
};

export default ForgotPassword;
