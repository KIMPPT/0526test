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
let id = 1;
export default function Home() {
  const [books, setBooks] = useState();
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [search, Setsearch] = useState();
  const date = new Date();
  const [resultbook, setResultbook] = useState();
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    const querySnapshot = await getDocs(collection(db, "booklist"));
    let dataArray = [];
    querySnapshot.forEach((doc) => {
      dataArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setBooks(dataArray);
    setTitle("");
    setWriter("");
  }
  const addBooklist = async () => {
    await setDoc(doc(db, "booklist", id.toString()), {
      title,
      writer,
      done: false,
      memo: "",
      startDate: Timestamp.fromDate(date),
    });
    id += 1;
    getData();
  };
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
    await updateDoc(doc(db, "booklist", id), {
      done: true,
      memo: prompt("느낀점을 적어주세요"),
      endDate: date,
    });
    getData();
  };
  return (
    <div>
      <h1>readingbooks 컬렉션</h1>
      <h3>책 추가</h3>
      <label>책 이름</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <br />
      <label>작가 이름</label>
      <input
        type="text"
        onChange={(e) => setWriter(e.target.value)}
        value={writer}
      />
      <br />
      <button
        onClick={addBooklist}
        disabled={title === "" || writer === "" ? true : false}
      >
        {title === "" || writer === "" ? "책과 작가를 다 입력해주세요" : "추가"}
        {/*임의로 만들어놓은 조건부. required를 쓸려고 하니 setState에 빈 값이면 동작상에는 오류가 없지만 관리자 모드에서는 오류가 나옴.
        반대로 setState 오류를 없애기 위해 빈 문자열("")을 넣으면 required가 동작하지 않는다. 서로가 서로를 막는 상황
        문자가 시작하기 전까지 생성되는 의미없는 빈 공백을 구분하는 식을 당장 만들기에는 조건을 깊게 생각해봐야해서 빈 문자열이 둘 다 없을때만 동작하도록 해놓음
        */}
      </button>
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
              {`${x.startDate.toDate().getMonth() + 1}/${x.startDate
                .toDate()
                .getDate()}`}
              ~
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
