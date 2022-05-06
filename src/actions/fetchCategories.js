export const fetchCategories = async (token,request)=>{
    try {
        return await request('/api/category/', 'GET', null, {Authorization: `Bearer ${token}`})
      } catch (error) {
      }
}
  