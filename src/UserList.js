import React from 'react';
import './UserList.css';
let deleteUsersArr = [];
let filteredArray = [];
const User = {
  id: "",
  fname: "",
  lname: "",
  email: "",
  password: "",
  balance: "",
  numberOfSessions: ""
}
const DisplayUser = ({body}) => {
  const userArr = body;
  const fullname = userArr.fname + " " + userArr.lname;

  const handleChangeChk = function (e) {

    let id = e.target.getAttribute("data-value")
    fetch("https://userlist-1acd.restdb.io/rest/user-list/" + id, {
  method: 'DELETE',
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "x-apikey": "5ddd96bf4658275ac9dc1f88",
    "cache-control": "no-cache"
  },
  body: JSON.stringify({id: id})
})
.then(res => res.text()) 
.then(res => window.location.reload())
     
       
};
  return (
    <tr key={userArr._id} data-index={userArr._id}>
      <td align="left">{fullname}</td>
      <td align="left">{userArr.email}</td>
      <td align="left">{userArr.password}</td>
      <td align="left">{userArr.numberOfSessions}</td>
      <td align="left">{userArr.balance}
      </td>
      <td className="checkbox-td" align="right">
       
          <img className="delete-img" data-value={userArr._id} onClick={handleChangeChk} src="delete-img.png" alt="Delete user"></img>

      </td>
    </tr>

  );

};
class TableHeadCategory extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this
      .handleClick
      .bind(this);
  }

  handleClick(userArray, e) {
    let sortBy = e
      .target
      .getAttribute("data-th");

    document
      .querySelectorAll(".category-item")
      .forEach(item => {
        if (item.classList.contains("active-category")) {
          item
            .classList
            .remove("active-category")
        }
      });
    e
      .target
      .classList
      .toggle("active-category");
    userArray
      .userArray
      .array
      .sort((a, b) => (a[sortBy] > b[sortBy])
        ? 1
        : -1);

    const updatedArray = userArray.userArray;
    this
      .props
      .onCLickChange(updatedArray);
  }
  render() {
    let userArray = this.props.array;
    return (
      <thead>
        <tr>
          <td className="category" align="left">
            <span
              data-th="lname"
              onClick={(e) => this.handleClick(userArray, e)}
              className="category-item">Name</span>
          </td>
          <td className="category" align="left">
            <span
              data-th="email"
              onClick={(e) => this.handleClick(userArray, e)}
              className="category-item">Email</span>
          </td>
          <td className="category" align="left">
            <span
              data-th="password"
              onClick={(e) => this.handleClick(userArray, e)}
              className="category-item">Password</span>
          </td>
          <td className="category" align="left">
            <span
              data-th="numberOfSessions"
              onClick={(e) => this.handleClick(userArray, e)}
              className="category-item">Log-ins</span>
          </td>
          <td className="category" align="left">
            <span
              data-th="balance"
              onClick={(e) => this.handleClick(userArray, e)}
              className="category-item">Balance</span>
          </td>
        </tr>
      </thead>
    );
  }
}
function NumberOfUsers(props) {
  return (
    <p>
      <b>{props.array.userArray.array.length}</b>
      users</p>
  )
}
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterCHange = this
      .onFilterCHange
      .bind(this);
  }

  onFilterCHange(userArray, e) {
    filteredArray = [];
    let filterBy = e
      .target
      .getAttribute("data-th");
    userArray
      .array
      .forEach(e => {
        if (e.numberOfSessions <= 1) {
          filteredArray.push(e);
        }
      });
    let array = [];

    switch (filterBy) {
      case 'filterAll':
        array = userArray.array;
        break;
      case 'filterActive':
        array = userArray
          .array
          .filter(x => !filteredArray.includes(x));
        break;
      case 'notActive':
        array = userArray
          .array
          .filter(x => filteredArray.includes(x));
        break;
    }

    let updatedArray = {
      array
    };

    this
      .props
      .onFilterCHange(updatedArray);

  }

  render() {
    return (
      <div className="header-wrapper">
        <div>
          <h4>Displaying</h4>
          <h1>User Information List</h1>
          <div className="number-of-users">
            <img src="users-icon.png" alt="users"></img>
            <NumberOfUsers array={this.props.array}/>
          </div>
        </div>
        <div className="actionButtonWrapper">
          <div>
            <ActionButtons array={this.props.array}/>
          </div>
          <div>
            <h4>Filter by:</h4>
            <button
              data-th="filterAll"
              className="filterActive"
              onClick={(e) => this.onFilterCHange(this.props.originalArray, e)}>All</button>
            <button
              data-th="filterActive"
              className="filterActive"
              onClick={(e) => this.onFilterCHange(this.props.originalArray, e)}>Active</button>
            <button
              data-th="notActive"
              className="filterActive"
              onClick={(e) => this.onFilterCHange(this.props.originalArray, e)}>Not active</button>
          </div>
        </div>
      </div>
    )
  }
}

function Loading() {
  return (
    <div className="LoadingScreen">
      <div class="loading">
        <p>Please wait</p>
        <span>
          <i></i>
          <i></i>
        </span>
      </div>
    </div>
  )

}
function addUser(e) {
  document
    .querySelector(".addUserModal")
    .classList
    .add("modal-visible");
  document
    .querySelector(".closeModal")
    .classList
    .add("closeModalSectionVisible");
}
function deleteUser(e, userArr) {

  let updatedArr = userArr
    .array
    .userArray
    .array
    .filter(x => deleteUsersArr.includes(x));
  console.log(updatedArr)
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleSubmit(event) {

    const form = document.querySelector("form");
    let userArray = this.props.value.userArray.array;

    let emailInUse = checkEmailInUse(userArray);
    function checkEmailInUse(userArray) {
      let value = false;
      for (let i = 0; i < userArray.length; i++) {
        if (form.elements.email.value == userArray[i].email) {
          value = true;
        }
      }
      return value
    }

    const user = Object.create(User);
    user.fname = form.elements.firstname.value;
    user.lname = form.elements.lastname.value;
    user.email = form.elements.email.value;
    user.id = generateUUiD();
    user.password = form.elements.password.value;
    user.balance = form.elements.balance.value;
    user.numberOfSessions = 0;
    //GENERATE UNIQUE ID FOR EACH USER
    function generateUUiD() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }
    event.preventDefault();

    (!emailInUse
      ? PostToDB(user)
      : alert("This email is already taken"))

    function PostToDB(data) {
      document
        .querySelector(".addUserModal")
        .classList
        .remove("modal-visible");
      document
        .querySelector(".closeModal")
        .classList
        .remove("closeModalSectionVisible");
      const postData = JSON.stringify(data);
      fetch("https://userlist-1acd.restdb.io/rest/user-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-apikey": "5ddd96bf4658275ac9dc1f88",
          "cache-control": "no-cache"
        },
        body: postData
      }).then(response => {
        response.json();
        window
          .location
          .reload();
      })
    }

  }

  render() {
    return (
      <form className="addUserForm" onSubmit={this.handleSubmit}>
        <label>First name</label>
        <input
          type="text"
          id="fname"
          name="firstname"
          placeholder="First name"
          required/>
        <label>Last name</label>
        <input type="text" id="lname" name="lastname" placeholder="Last Name" required/>
        <label>E-mail</label>
        <input type="email" id="email" name="email" placeholder="E-mail" required/>
        <label>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required/>
        <label>Balance</label>
        <input type="text" id="balance" name="balance" placeholder="Balance" required/>
        <div>
          <input type="submit" id="submit-login" value="Add user"></input>
        </div>
      </form>
    )
  }

}

function AddUserModal(props) {

  function closeModal(e) {
    e.preventDefault();
    document
      .querySelector(".addUserModal")
      .classList
      .remove("modal-visible");
    document
      .querySelector(".closeModal")
      .classList
      .remove("closeModalSectionVisible")
  }
  return (
    <React.Fragment>
      <div className="closeModal" onClick={closeModal}></div>
      <div className="addUserModal">
        <img
          className="close-modal-img"
          src="close-modal.png"
          alt="close"
          onClick={closeModal}></img>
        <div className="addUserHeadingWrapper">
          <img className="user-icon" src="user-icon.png" alt="close"></img>
          <h1>Add user</h1>
        </div>
        <Form value={props.array}/>
      </div>
    </React.Fragment>
  )
}

function ActionButtons(props) {
  return (
    <div className="actionButtonsWrapper">
      <button className="actionButton addUser" onClick={(e) => addUser(e)}>Add user</button>
      <button
        className="actionButton deleteUser"
        onClick={(e) => deleteUser(e, props)}>Delete user</button>
    </div>
  )
}

class CreateTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleArrayChange = this
      .handleArrayChange
      .bind(this);
    this.handleFilterChange = this
      .handleFilterChange
      .bind(this);
    this.state = {
      userArray: this.props
    };

  }
  handleArrayChange(updatedArray) {
    console.log(updatedArray)
    this.setState({userArray: updatedArray});
  }
  handleFilterChange(updatedArray) {
    this.setState({userArray: updatedArray});
  }

  render() {
    const userArray = this.state;
    const userListArray = this.state.userArray.array;
    const notFilteredArray = this.props;

    return (
      <div className="content">
        <Header
          onFilterCHange={this.handleFilterChange}
          originalArray={notFilteredArray}
          array={userArray}/>
        <AddUserModal array={userArray}/>
        <table className="rwd-table">
          <TableHeadCategory array={userArray} onCLickChange={this.handleArrayChange}/>
          <tbody>
            {Object
              .keys(userListArray)
              .map(key => <DisplayUser key={key} body={userListArray[key]}/>)}
          </tbody>
        </table>
      </div>
    );

  }
}

class UserList extends React.Component {
  state = {
    isLoading: true,
    userArray: [],
    error: null
  };
  fetchUsers() {
    fetch("https://userlist-1acd.restdb.io/rest/user-list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-apikey": "5ddd96bf4658275ac9dc1f88",
          "cache-control": "no-cache"
        }
      })
      .then(response => response.json())
      .then(data => this.setState({userArray: data, isLoading: false}))
      .catch(error => this.setState({error, isLoading: false}));
  }
  componentDidMount() {
    this.fetchUsers();
  }

  render() {
    const {isLoading, userArray, error} = this.state;

    return (
      <React.Fragment>
        {!isLoading
          ? <CreateTable array={userArray}/>
          : <Loading/>}
      </React.Fragment>

    );
  }
}

export default UserList;
