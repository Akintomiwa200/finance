import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    departmentId?: string;
    organizationId?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      departmentId: string;
      organizationId: string;
    };
  }
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}
