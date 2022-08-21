import {
  Box,
  Button,
  Flex,
  Link,
  ListItem,
  Text,
  Textarea,
  UnorderedList,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiCompass } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  getAllProjects,
  getProjectById,
  getAllDivergencePointsByMapId,
} from "strateegia-api";
import Loading from "../components/Loading";
import SimpleSidebar from "./SimpleSidebar";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { MAIN_COLOR, SECOND_COLOR, TITLE } from "../components/defaults";

export default function Main() {
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [projectList, setProjectList] = useState(null);
  const [mapList, setMapList] = useState([]);
  const [divPointList, setDivPointList] = useState([]);

  const handleSelectProject = (e) => {
    // console.log("click %o", e.target.id);
    setSelectedProject(e.target.id);
    // setMapList([]);
  };

  const handleRefresh = (e) => {
    console.log("refresh!");
    fetchProjectList(accessToken);
  };

  useEffect(() => {
    console.log("projectList %o", projectList);
  }, [projectList]);

  useEffect(() => {
    console.log("mapList %o", mapList);
  }, [mapList]);

  async function fetchProjectList(accessToken) {
    setIsLoading(true);
    try {
      const projectList_ = await getAllProjects(accessToken);
      // console.log('projectList: %o', projectList);
      const simplifiedProjectList = projectList_.map((lab) => {
        return lab.projects.map((project) => {
          return {
            title: `${lab.lab.name ? lab.lab.name : "public"} - ${
              project.title
            }`,
            id: project.id,
          };
        });
      });
      setProjectList(simplifiedProjectList.flatMap((item) => item));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const accessToken_ = localStorage.getItem("accessToken");
    fetchProjectList(accessToken_);
    setAccessToken(accessToken_);
  }, []);

  useEffect(() => {
    async function fetchReferences(accessToken) {
      try {
        const projectDetails = await getProjectById(
          accessToken,
          selectedProject
        );
        console.log("projectDetails %o", projectDetails);
        const mapIdPromiseAll = [];
        const auxMapsList = [];
        projectDetails.maps.forEach((map) => {
          auxMapsList.push({ id: map.id, title: map.title });
          mapIdPromiseAll.push(
            getAllDivergencePointsByMapId(accessToken, map.id)
          );
        });
        // setMapList([...auxMapsList]);
        const responses = await Promise.all(mapIdPromiseAll);
        const divPoints = responses.flatMap((item) => item.content);
        const divPointsWithMapTitle = divPoints.map((divPoint) => {
          return {
            ...divPoint,
            map_title: auxMapsList.find((item) => item.id === divPoint.map_id)
              .title,
          };
        });
        console.log("promise all %o", divPointsWithMapTitle);
        setDivPointList([...divPointsWithMapTitle]);
      } catch (error) {
        console.log(error);
      }
    }
    fetchReferences(accessToken);
  }, [accessToken, selectedProject]);

  const sideBarProjects = projectList?.map((project) => {
    return { name: project.title, id: project.id, icon: FiCompass };
  });

  const projectTitle = projectList?.find(
    (e) => e.id === selectedProject
  )?.title;

  return (
    <>
      {!isLoading ? (
        <SimpleSidebar
          sideBarItems={sideBarProjects}
          handleClick={handleSelectProject}
        >
          <Flex
            mx={{ base: "20px", md: "45px" }}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Text
              textAlign={{ base: "center", md: "left" }}
              h={{ base: "100%", md: "80px" }}
              py={{ base: "10px", md: "20px" }}
              fontWeight="bold"
              fontSize={{ base: "lg", md: "xl" }}
            >
              {projectTitle}
            </Text>
            <Icon
              fontSize="30"
              _hover={{
                color: { MAIN_COLOR },
              }}
              cursor="pointer"
              as={HiOutlineRefresh}
              onClick={handleRefresh}
            />
          </Flex>
          <Box
            padding="none"
            m="none"
            as="hr"
            borderBottom="sm"
            borderColor={MAIN_COLOR}
          />
          <Box px={6}>
            <Box margin={10}>
              <UnorderedList margin={5}>
                {divPointList.map((divPoint) => {
                  return (
                    <>
                      <Text as="h1" fontSize="xl" mt="20px" mb={3}>
                        ponto de divergência:{" "}
                        <strong>{divPoint.tool.title}</strong>
                        <Box
                          padding="none"
                          m="none"
                          as="hr"
                          borderBottom="sm"
                          borderColor={MAIN_COLOR}
                        />
                      </Text>
                      {divPoint.tool.references ? "===== REFs =====" : null}
                      {divPoint.tool.references.map((ref) => {
                        return (
                          <Link href={ref.url} isExternal>
                            <ListItem mb={1}>
                              <strong>{ref.description}</strong> {ref.url}
                            </ListItem>
                          </Link>
                        );
                      })}
                      {divPoint.attached_links.length
                        ? "===== LINKS ====="
                        : null}
                      {divPoint.attached_links.map((link) => {
                        return (
                          <Link href={link.url} isExternal>
                            <ListItem mb={1}>
                              <strong>{link.title}</strong> {link.url}
                            </ListItem>
                          </Link>
                        );
                      })}
                    </>
                  );
                })}
              </UnorderedList>
            </Box>
          </Box>
        </SimpleSidebar>
      ) : (
        <>
          <Loading active={isLoading} />
        </>
      )}
    </>
  );
}
