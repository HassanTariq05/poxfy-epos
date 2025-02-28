import Api from "../../network/client";

// export const changeSlugStatus = async (id, slug, data) => {
//   return Api.put(`product-slug/${slug}/${id}`, data);
// };

// export const update = async (slug, data, id) => {
//   return Api.put(`product-slug/${slug}/${id}`, data);
// };
// export const getAllSlugApi = async (slug) => {
//   return Api.get(`product-slug/${slug}`);
// };
// export const deleteslug = async (slug, id) => {
//   return Api.delete(`product-slug/${slug}/${id}`);
// };

export const getAllAttributeApi = async () => {
  return Api.get(`product/attributes`);
};
export const getAllProduct = async (outletId = undefined) => {
  let q = "";
  if (outletId) {
    q = `outletIds=${outletId}`;
  }
  return Api.get(`product?${q}`);
};
export const getAllVariantProduct = async () => {
  return Api.get(`product/by-variants`);
};
export const getProductById = async (id) => {
  return Api.get(`product/${id}`);
};
export const createProduct = async (data) => {
  return Api.post(`product`, data);
};
export const updateProduct = async (data, id) => {
  return Api.put(`product/${id}`, data);
};

export const deleteProductById = async (id) => {
  return Api.delete(`product/${id}`);
};
export const getAllProductsByTypeId = async (id, searchText) => {
  let q = "";
  if (id) {
    q = `&productTypeIds=${id}`;
  }
  return Api.get(`product?name=${searchText}&${q}`);
};
