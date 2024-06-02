export class Tenant {
    id: string = '';
    fullName?: string = '';

    constructor(data: Partial<Tenant> = {}) {
      Object.assign(this, data);
    }
  }