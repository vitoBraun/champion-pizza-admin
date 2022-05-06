export const fetchProductsByCategory = async (token,request, selectedCategory)=>{
    try {
        return await request('/api/product/'+selectedCategory, 'GET', null, {Authorization: `Bearer ${token}`})
        
      } catch (error) {
        console.log(error)
      }
}


  