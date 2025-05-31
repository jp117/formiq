export interface Component {
  id: string
  component_name: string
  catalog_number?: string
  quantity: number
  received: boolean
  notes?: string
  original_scheduled_ship_date: string
  current_scheduled_ship_date: string
}

export interface PurchaseOrder {
  id: string
  po_number: string
  vendor?: string
  components: Component[]
}

export interface BaseItem {
  id: string
  sales_order_number: string
  customer: string
  job_name?: string
  job_address?: string
  dwg_rev?: string
  completed: boolean
  original_scheduled_ship_date: string
  current_scheduled_ship_date: string
  purchase_orders: PurchaseOrder[]
}

export interface Switchboard extends BaseItem {
  designation: string
  nema_type: string
  number_of_sections: number
}

export interface Integration extends BaseItem {
  designation: string
  type: string
}

export interface MiscItem extends BaseItem {
  quantity: number
  description: string
}

export interface CommonFormData {
  sales_order_number: string
  customer: string
  job_name: string
  job_address: string
  dwg_rev: string
  completed: boolean
  original_scheduled_ship_date: string
  current_scheduled_ship_date: string
}

export interface SwitchboardFormData extends CommonFormData {
  designation: string
  nema_type: string
  number_of_sections: number
}

export interface IntegrationFormData extends CommonFormData {
  designation: string
  type: string
}

export interface MiscFormData extends CommonFormData {
  quantity: number
  description: string
} 