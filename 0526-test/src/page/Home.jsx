import React, { useEffect, useState } from "react";
import { db } from "../database/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
export default function Home() {
  const [users, setUsers] = useState();
  const [title, setTitle] = useState();
  const [writer, setWriter] = useState();
  const [search, Setsearch] = useState();
  const [memo, setMemo] = useState();
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
    setUsers(dataArray);
  }
  const addBooklist = async () => {
    const docRef = await addDoc(collection(db, "booklist"), {
      title,
      writer,
      done: false,
      memo: "",
      startDate: Timestamp.fromDate(date),
    });
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
      <input type="text" onChange={(e) => setTitle(e.target.value)} />
      <br />
      <label>작가 이름</label>
      <input type="text" onChange={(e) => setWriter(e.target.value)} />
      <br />
      <button onClick={addBooklist}>추가</button>
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
      {users &&
        users.map((x) => (
          <div key={x.id}>
            <h3>
              {`${x.startDate.toDate().getMonth() + 1} / ${x.startDate
                .toDate()
                .getDate()}`}
              ~
              {x.endDate
                ? `${x.endDate.toDate().getMonth() + 1} / ${x.endDate
                    .toDate()
                    .getDate()}`
                : "읽는 중"}
            &nbsp;{x.title}
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

            <button onClick={() => deletebook(x.id)}>X</button>
          </div>
        ))}
    </div>
  );
}
