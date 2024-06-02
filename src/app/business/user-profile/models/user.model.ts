import { Tenant } from "./tenant.model";

export class User {
    id: string = '';
    email: string = '';
    tenantId: string = '';
    authProvider: string = '';
    tenant: Tenant = new Tenant();
  
  
    constructor(data: Partial<Tenant> = {}) {
      Object.assign(this, data);
    }
  }