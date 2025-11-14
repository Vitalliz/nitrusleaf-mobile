const loadData = useCallback ( async () => { 
  try { 
    const db = await  connectToDatabase () 
    await  createTables (db) 
  } catch (error) { 
    console . error (error) 
  } 
}, []) 

useEffect ( () => { 
  loadData () 
}, [loadData])