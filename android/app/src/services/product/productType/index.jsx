import Api from "../../../network/client";

export const changeProductTypeStatus = async (id, data) => {
  return Api.put(`product-type/${id}`, data);
};
export const createProductType = async (data) => {
  return Api.post(`product-type`, data);
};
export const updateProductType = async (data, id) => {
  return Api.put(`product-type/${id}`, data);
};
export const getAllProductTypeApi = async () => {
  return Api.get(`product-type`);
};
export const deleteProductTypeApi = async (id) => {
  return Api.delete(`product-type/${id}`);
};
