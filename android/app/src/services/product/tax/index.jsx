import Api from "../../../network/client";

export const changeTaxStatus = async (id, slug, data) => {
  return Api.put(`${slug}/${id}`, data);
};
export const createTax = async (slug, data) => {
  return Api.post(`${slug}`, data);
};
export const updateTax = async (slug, data, id) => {
  return Api.put(`${slug}/${id}`, data);
};
export const getAllTaxApi = async (slug) => {
  return Api.get(`${slug}`);
};
export const deleteTax = async (slug, id) => {
  return Api.delete(`${slug}/${id}`);
};
