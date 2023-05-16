import { useEffect } from "react";
import {
  getAllProjectError,
  getAllProjectStart,
  getAllProjectSuccess,
} from "../../redux/slice/projectSlice";

import axios from "axios";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppSelector } from "../../redux/hook";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const token = useAppSelector((state: RootState) => state.auth.userInfo.token);
  const listProject = useAppSelector(
    (state: any) => state.project?.listProject
  );
  useEffect(() => {
    (async () => {
      dispatch(getAllProjectStart());

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/project/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(getAllProjectSuccess(res.data));
      } catch (error) {
        dispatch(getAllProjectError());
      }
    })();
  }, [token]);

  return (
    <div className="dashboard">
      {listProject.projects?.map((project: any) => {
        return (
          <Link
            to={`/${project._id}`}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {project.name}
          </Link>
        );
      })}
    </div>
  );
};

export default Dashboard;
