import React,{useState} from 'react'
import { addDoc , collection, Timestamp,setDoc,doc } from 'firebase/firestore';
import { db } from '../database/firebase';
export default function AddBook({getData,id,date}) {
    console.log(id)
      const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
    const addBooklist = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "booklist", id.toString()), {
      title,
      writer,
      done: false,
      memo: "",
      startDate: Timestamp.fromDate(date),
    });
    id += 1;
    getData();
    setTitle("");
    setWriter("");
  };
  return (
    <div>
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
    </div>
  )
}
