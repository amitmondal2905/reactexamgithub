import axios from "axios";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const GitUser = () => {
  const [username, setUsername] = useState("");
  const [userdata, setData] = useState(null);
  const [error, setError] = useState("");
  const [isloading, setLoading] = useState(false);
  const [userRepo, setUserRepo] = useState(null);


  const gitUserData = async () => {
    if (!username.trim()) {
      setError("Type User Name");
      return;
    }
    try {
      setError("");
      setLoading(true);
    
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      console.log(response?.data);
      setData(response?.data);
      gitUserRepo();
    } catch (err) {
      console.log("api error", err.response.status);
      setData(null);
      if (err.response.status === 403) {
        setError("Insufficient Permissions");
      } else {
        setError("User not found");
      }
    } finally {
      setLoading(false);
    }
  };

  const gitUserRepo = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      console.log(response?.data);
      setUserRepo(response?.data);
    } catch (err) {
      console.log("Repo error", err.message);
      setUserRepo(0);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    gitUserData();
  };

  const resetData = () => {
    setUsername("");
    setError("");
    setData(null);
    setUserRepo(null);
  };

  

  return (
    <>
      <div
        style={{
          maxWidth: "500px",
          margin: "20px auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>GitHub User Info</h2>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
            display: "flex",
            justifyContent: "center",
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleFormSubmit}
        >
          <TextField
            id="outlined-basic"
            label="Github User"
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            error={Boolean(error)}
            helperText={error}
          />
          <Stack direction="row" spacing={2} sx={{ width: 200 }}>
            <Button
              variant="outlined"
              startIcon={<ThreeSixtyIcon />}
              onClick={resetData}
              sx={{ height: 50 }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={gitUserData}
              type="submit"
              sx={{ height: 50 }}
            >
              Send
            </Button>
          </Stack>
        </Box>

        {isloading ? (
          
            <CircularProgress
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          
        ) : (
          userdata && (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "20px",
                boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={userdata.avatar_url}
                alt="avatar"
                width="100"
                style={{ borderRadius: "50%" }}
              />
              <h3>{userdata.name || userdata.login}</h3>
              <p>
                <strong>Username:</strong> {userdata.login}
              </p>
              <p>
                <strong>ID:</strong> {userdata.id}
              </p>
              {userdata.bio && (
                <p>
                  <strong>Bio:</strong> {userdata.bio}
                </p>
              )}
              {userdata.company && (
                <p>
                  <strong>Company:</strong> {userdata.company}
                </p>
              )}
              {userdata.location && (
                <p>
                  <strong>Location:</strong> {userdata.location}
                </p>
              )}
              <p>
                <strong>Followers:</strong> {userdata.followers}
              </p>
              <p>
                <strong>Following:</strong> {userdata.following}
              </p>

              <p>
                <strong>Profile:</strong>{" "}
                <a href={userdata.html_url} target="_blank">
                  {userdata.html_url}
                </a>
              </p>
              {Array.isArray(userRepo) &&
                userRepo.map((value) => {
                  return (
                    <div key={value.id}>
                      <p>
                        <strong>Public Repos:</strong> {value.public_repos}
                      </p>
                      <p>
                        <strong>Repo-URL:</strong>{" "}
                        <a href={value.url} target="_blank">
                          {value.url}
                        </a>
                      </p>
                      <p>
                        <strong>Repo-Name:</strong> {value.name}
                      </p>
                      <p>
                        <strong>Repo-Stars:</strong> {value.stargazers_count}
                      </p>
                      <p>
                        <strong>Repo-Forks:</strong> {value.forks_count}
                      </p>
                    </div>
                  );
                })}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default GitUser;
