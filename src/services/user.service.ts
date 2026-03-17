// import { setSession } from "@/slices/user.slice";
import { setSession } from "@/features/session.slice";
import { api } from "@/libs/api";
import {
  IGetUserByIdDTO,
  IGetUsersDTO,
  IUser,
  IUserInviteDTO,
  IUserPutDTO,
} from "@/types/user.type";
import { convertToFormData } from "@/utils/converteToFormData";

export namespace ILoginDTO {
  export type Args = {
    email: string;
    password: string;
    productId?: string;
  };
  export type Result = {
    token: string;
    user: IUser;
  };
}

export namespace ILoginEmailDTO {
  export type Args = {
    id: string;
    type?: "PURCHASED_ORDER" | "FIRST_LOGIN";
  };
  export type Result = {
    token: string;
    user: IUser;
    action?: "CREATE_PASSWORD";
    temporaryToken?: string;
  };
}

export namespace IRefreshDTO {
  export type Args = string;
  export type Result = {
    token: string;
    user: IUser;
  };
}

export namespace IUpdateUserDTO {
  export type Args = {
    name: string;
    phone?: {
      country?: string;
      ddd?: string;
      number?: string;
    };
    document?: string;
    documentType?: "CPF" | "CNPJ";
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    rankingName?: string;
    visibility?: "PUBLIC" | "PRIVATE";
  };

  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace ISignInOauthDTO {
  export type Args = {
    provider: "GOOGLE";
    accessToken: string;
    type: "TOKEN" | "CREDENTIAL";
    productCode?: string | null;
  };
  export type Result = {
    token: string;
  };
}

export namespace ISignUpDTO {
  export type Args = {
    name: string;
    email: string;
    password: string;
    phone: string;
    verifyPassword: string;
    terms: boolean;
  };
  export type Result = {
    token: string;
    user: IUser;
  };
}

export namespace IRequestPasswordChangeDTO {
  export type Args = {
    email: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IValidatePasswordChangeDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
    isValid: boolean;
  };
}

export namespace IConfirmPasswordChangeDTO {
  export type Args = {
    id: string;
    password: string;
    verifyPassword: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace ICreatePasswordDTO {
  export type Args = {
    temporaryToken: string;
    password: string;
    verifyPassword: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export const userSessionServices = api.injectEndpoints({
  endpoints: (builder) => ({
    authLogin: builder.mutation<ILoginDTO.Result, ILoginDTO.Args>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: {
          ...data,
        },
      }),
    }),
    authLoginSso: builder.mutation<ILoginDTO.Result, { ssoToken: string }>({
      query: (data) => ({
        url: `auth/login-sso?token=${data.ssoToken}`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.token) {
            dispatch(setSession({ user: data.user, token: data.token }));
            window.location.href = "/spy";
          }
        } catch {}
      },
    }),
    authLoginEmail: builder.query<ILoginEmailDTO.Result, ILoginEmailDTO.Args>({
      query: (data) => ({
        url: `/auth/magic-link/${data.id}`,
        method: "POST",
        body: data,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
          const { data } = await queryFulfilled;

          // if (data?.token && data.action === undefined && data.temporaryToken === undefined) {
          //   dispatch(userSessionServices.endpoints.authSession.initiate(data.token));
          //   window.location.href = "/dashboard";
          // }
        } catch {}
      },
    }),
    authSession: builder.query<IRefreshDTO.Result, IRefreshDTO.Args>({
      query: (token) => ({
        url: "/auth/sessions",
        method: "POST",
        headers: {
          authorization: `Bearer ` + token,
        },
      }),
      providesTags: [{ type: "session", id: "current" }],
    }),
    signInOauth: builder.mutation<ISignInOauthDTO.Result, ISignInOauthDTO.Args>({
      query: (data) => ({
        url: "auth/oauth",
        method: "POST",
        body: {
          ...data,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.token) {
            await dispatch(userSessionServices.endpoints.authSession.initiate(data.token));
            window.location.href = "/spy";
          }
        } catch {}
      },
    }),
    singUp: builder.mutation<ISignUpDTO.Result, ISignUpDTO.Args>({
      query: (data) => ({
        url: "users",
        method: "POST",
        body: data,
      }),
    }),
    requestPasswordChange: builder.mutation<
      IRequestPasswordChangeDTO.Result,
      IRequestPasswordChangeDTO.Args
    >({
      query: (data) => ({
        url: "users/request-password-change",
        method: "POST",
        body: data,
      }),
    }),
    validatePasswordChange: builder.query<
      IValidatePasswordChangeDTO.Result,
      IValidatePasswordChangeDTO.Args
    >({
      query: (data) => ({
        url: `users/validate-password-change/${data.id}`,
        method: "GET",
      }),
    }),
    confirmPasswordChange: builder.mutation<
      IConfirmPasswordChangeDTO.Result,
      IConfirmPasswordChangeDTO.Args
    >({
      query: (data) => ({
        url: `users/confirm-password-change/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    createPassword: builder.mutation<ICreatePasswordDTO.Result, ICreatePasswordDTO.Args>({
      query: (data) => ({
        url: `users/update-password`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation<IUpdateUserDTO.Result, IUpdateUserDTO.Args>({
      query: (args) => ({
        url: `users`,
        method: "PUT",
        body: args,
      }),
      invalidatesTags: [{ type: "session", id: "current" }],
    }),
    updateUserImage: builder.mutation<IUpdateUserDTO.Result, { image: File }>({
      query: (data) => ({
        url: `users/image`,
        method: "PUT",
        body: convertToFormData(data),
      }),
      invalidatesTags: [{ type: "session", id: "current" }],
    }),
    getUsers: builder.query<IGetUsersDTO.Result, IGetUsersDTO.Args>({
      query: (args) => ({
        url: `users`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "users", id: "list" }],
    }),
    postUserInvite: builder.mutation<IUserInviteDTO.Result, IUserInviteDTO.Args>({
      query: (args) => ({
        url: `users/invite`,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: "users", id: "list" }],
    }),
    putUser: builder.mutation<IUserPutDTO.Result, IUserPutDTO.Args>({
      query: (args) => ({
        url: `users`,
        method: "PUT",
        body: args,
      }),
      invalidatesTags: [{ type: "users", id: "list" }],
    }),
    getUserById: builder.query<IGetUserByIdDTO.Result, IGetUserByIdDTO.Args>({
      query: (args) => ({
        url: `users/${args.id}`,
        method: "GET",
      }),
      providesTags: [{ type: "users", id: "list" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAuthLoginMutation,
  useAuthSessionQuery,
  useLazyAuthSessionQuery,
  useAuthLoginEmailQuery,
  useAuthLoginSsoMutation,
  useSignInOauthMutation,
  useSingUpMutation,
  useRequestPasswordChangeMutation,
  useValidatePasswordChangeQuery,
  useConfirmPasswordChangeMutation,
  useCreatePasswordMutation,
  useUpdateUserMutation,
  useUpdateUserImageMutation,
  useGetUsersQuery,
  usePostUserInviteMutation,
  usePutUserMutation,
  useGetUserByIdQuery,
} = userSessionServices;
