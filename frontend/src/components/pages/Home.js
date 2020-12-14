import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

import { AiFillEdit, AiFillDelete } from "react-icons/ai";

function Home() {
  const [nameProject, setNameProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [nameTask, setNameTask] = useState("");
  const [taskIndex, setTaskIndex] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskChecked, setTaskChecked] = useState(false);

  const [error, setError] = useState();

  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    }
  });

  // CREATE PROJECT
  const createProject = async (e) => {
    e.preventDefault();
    try {
      const newProject = {
        title: nameProject,
      };

      setProjects([...projects, JSON.stringify(newProject)]);
      setNameProject("");
      //console.log(projects);
      await Axios.post("http://localhost:5000/projects/", newProject, {
        headers: {
          "x-auth-token": userData.token,
        },
      });
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  // GET PROJECTS
  useEffect(() => {
    const getProjects = async () => {
      const response = await Axios.get("http://localhost:5000/projects/all", {
        headers: {
          "x-auth-token": userData.token,
        },
      });
      setProjects(response.data);
      //console.log(projects);
      //setLoading(false);
    };

    getProjects();
  }, [userData.token, projects, tasks]);

  // DELETE PROJECT

  const deleteProject = async (index) => {
    try {
      await Axios.delete(
        `http://localhost:5000/projects/delete/${projects[index]._id}`,
        {
          headers: {
            "x-auth-token": userData.token,
          },
        }
      );
      setProjects(projects.filter((item) => item.id !== index));
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  //ADD TASK
  const createTask = async (e) => {
    e.preventDefault();
    console.log(nameTask, taskIndex, projects[taskIndex]._id);
    //console.log(e.target);
    try {
      const newTask = {
        description: nameTask,
      };

      setTasks([...tasks, JSON.stringify(newTask)]);
      //console.log(tasks);
      //setNameTask("");

      await Axios.put(
        `http://localhost:5000/projects/task/add/${projects[taskIndex]._id}`,
        newTask,
        {
          headers: {
            "x-auth-token": userData.token,
          },
        }
      );
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  // DELETE TASK
  const deleteTask = async (projectId, taskId) => {
    //console.log(nameTask, taskIndex, projects[taskIndex]._id);
    //console.log(e.target);

    const deletedTaskId = {
      id: taskId,
    };

    console.log(JSON.stringify(deletedTaskId));
    //setTasks(tasks.filter((item) => item.id !== taskId));
    //console.log(projectId, projectId);
    try {
      await Axios.delete(
        `http://localhost:5000/projects/task/delete/${projectId}`,
        JSON.stringify(deletedTaskId),
        {
          headers: {
            "x-auth-token": userData.token,
          },
        }
      );
      console.log("ola");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="container">
      {userData.user && (
        <h1 style={{ textAlign: "center" }}>
          Welcome, {userData.user.displayName}!
        </h1>
      )}
      <section>
        <h3>Create new project</h3>
        {error && (
          <ErrorNotice message={error} clearError={() => setError(undefined)} />
        )}
        <form className="form" onSubmit={createProject}>
          <input
            id="create-project"
            type="text"
            value={nameProject}
            onChange={(e) => setNameProject(e.target.value)}
            placeholder="Project Name"
          ></input>
          <input type="submit" value="Create Project" />
        </form>
      </section>
      <section>
        {projects.map((project, index) => {
          // console.log(project.tasks);
          return (
            <section className="project" key={index}>
              <header>
                <h3>{project.title}</h3>
                <div>
                  <AiFillEdit className="project-action-btn" />
                  <AiFillDelete
                    className="project-action-btn"
                    onClick={() => {
                      deleteProject(index);
                    }}
                  />
                </div>
              </header>
              <div className="tasks">
                <h4>TO DO</h4>
                {project.tasks
                  ? project.tasks.map((task, index) => {
                      return (
                        task.isDone === false && (
                          <div key={index} className="tasks-checkbox">
                            <form className="form task-form">
                              <input
                                type="checkbox"
                                id="desc"
                                name="desc"
                                checked={taskChecked}
                                onChange={() => setTaskChecked(!taskChecked)}
                              />
                              <label htmlFor="desc">{task.description}</label>
                            </form>
                            <div>
                              <AiFillEdit />
                              <AiFillDelete
                                className="task-delete-icon"
                                onClick={() => {
                                  //setTaskIndex(index);
                                  deleteTask(project._id, task._id);
                                }}
                              />
                            </div>
                          </div>
                        )
                      );
                    })
                  : ""}
                <h4>DONE</h4>
                {project.tasks
                  ? project.tasks.map((task, index) => {
                      return (
                        task.isDone === true && (
                          <div key={index} className="tasks-checkbox">
                            <form className="form task-form">
                              <input
                                type="checkbox"
                                id="desc"
                                name="desc"
                                checked={taskChecked}
                                onChange={() => setTaskChecked(!taskChecked)}
                              />
                              <label
                                style={{ textDecoration: "line-through" }}
                                htmlFor="desc"
                              >
                                {task.description}
                              </label>
                            </form>
                          </div>
                        )
                      );
                    })
                  : ""}
                <div className="divider"></div>
                <section>
                  <form className="form task-add-form" onSubmit={createTask}>
                    <input
                      // key={index}
                      //id={nameTask}
                      type="text"
                      placeholder="Task"
                      //value={nameTask}
                      onChange={(e) => {
                        setNameTask(e.target.value);
                        setTaskIndex(index);
                      }}
                    ></input>
                    <input type="submit" value="ADD" />
                  </form>
                </section>
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}

export default Home;
