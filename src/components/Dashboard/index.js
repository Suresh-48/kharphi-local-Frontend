import React, { useEffect, useState } from "react";
import { ROLES_PARENT, ROLES_STUDENT, ROLES_TEACHER } from "../../constants/roles";
import AdminDashboard from "./AdminDashboard";
import ParentDashboard from "./ParentDashboard";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

function Dashboard(props) {
  const [role, setRole] = useState("");
  const isParent = role === ROLES_PARENT;
  const isStudent = role === ROLES_STUDENT;
  const isTeacher = role === ROLES_TEACHER;

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
  }, []);

  return (
    <>
      {isParent ? (
        <ParentDashboard />
      ) : isStudent ? (
        <StudentDashboard />
      ) : isTeacher ? (
        <TeacherDashboard />
      ) : (
        <AdminDashboard />
      )}
    </>
  );
}

export default Dashboard;
