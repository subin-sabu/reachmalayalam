import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useEffect, useState } from "react";


function ViewAllNews() {
  const [news, setNews] = useState(null);
  const [stringNews, setStringNews] = useState();



  useEffect(() => {
    async function getAllNews() {
      try {

      } catch (e) {

      }
      const newsRef = collection(db, 'news');
      const q = query(newsRef, limit(2))
      const querySnapshot = await getDocs(q);
      const newsData = querySnapshot.docs.map((e) => {
        const id = e.id;
        const obj = e.data()
        const newsLink = `https://www.reachmalayalam.com/${obj.category}/${id}`
        return {id, newsLink, ...obj};
      })
        console.log(newsData)
        setNews(newsData)
        // const str = JSON.stringify(newsData)
        // setStringNews(str)
    }

    getAllNews();
  }, []);


  return (
    <>
      <div>
        {stringNews ? stringNews : "loading..."}
      </div>
    </>
  )

}

export default ViewAllNews;