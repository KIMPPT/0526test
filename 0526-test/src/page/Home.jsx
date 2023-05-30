import React, { useEffect, useState } from "react";
import { db } from "../database/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import AddBook from "./AddBook";
//문서 값 : 번호로 부여를 해서 배열하기 편하게 하도록 임의로 잡아주는 값. 직접 변경을 해야 하므로 const가 아닌 let으로 설정
let id = 1;
export default function Home() {
  const [books, setBooks] = useState();

  const [search, Setsearch] = useState();
  const date = new Date();
  const [resultbook, setResultbook] = useState();
  useEffect(() => {
    getData();
  }, []);

  //return의 값을 출력하기 위한 함수
  //타임스탬프값을 넣으면 값을 변환해서 문자열로 return 하는 함수
  const printTime = (date) => {
    const month = date.toDate().getMonth() + 1;
    const day = date.toDate().getDate();
    return `${month}/${day}`;
  };
  async function getData() {
    const querySnapshot = await getDocs(collection(db, "booklist"));
    let dataArray = [];
    querySnapshot.forEach((doc) => {
      dataArray.push({
        id: doc.id,
        ...doc.data(),
      });
      //doc.date()객체 확인
      //doc.date()객체 확인> timestamp는 toDate를 통해 Date 객체로 변환
      console.dir(doc.data().startDate.toDate());
    });
    setBooks(dataArray);
  }

  const deletebook = async (id) => {
    await deleteDoc(doc(db, "booklist", id));
    getData();
  };
  const searchBook = async () => {
    const q = query(collection(db, "booklist"), where("title", "==", search));
    const querySnapshot = await getDocs(q);
    let dataArray = [];
    querySnapshot.forEach((doc) => {
      dataArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setResultbook(dataArray);
  };
  const updateData = async (id) => {
    const memo=prompt("느낀점을 적어주세요")
    if(!memo) return;
    await updateDoc(doc(db, "booklist", id), {
      done: true,
      memo,
      endDate: date,
    });
    getData();
  };
  return (
    <div>
      <h1>readingbooks 컬렉션</h1>
      <h3>책 추가</h3>
      <AddBook getData={getData} id={id} date={date}/>
      <hr />
      <input type="text" onChange={(e) => Setsearch(e.target.value)} />
      <button onClick={searchBook}>읽은 책 검색하기</button>
      {resultbook &&
        resultbook.map((book) => (
          <div key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.memo ? book.memo : "메모없음"}</p>
          </div>
        ))}
      <hr />
      {books &&
        books.map((x) => (
          <div key={x.id}>
            <h3>
              {/*console.log(x.startDate.toDate())*/}
              {printTime(x.startDate)}~
              {x.endDate
                ? `${x.endDate.toDate().getMonth() + 1}/${x.endDate
                    .toDate()
                    .getDate()}`
                : "읽는 중"}
              &nbsp;{x.title}&nbsp;글쓴이 : {x.writer}
            </h3>
            {x.done ? (
              <p>{x.memo}</p>
            ) : (
              <button
                onClick={() => {
                  updateData(x.id);
                }}
              >
                감상문 적기
              </button>
            )}
            &nbsp;
            <button onClick={() => deletebook(x.id)}>X</button>
          </div>
        ))}
    </div>
  );
}
