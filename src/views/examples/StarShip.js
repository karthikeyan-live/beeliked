/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Spinner,
  Row,
} from "reactstrap";
import moment from "moment";

// core components
import Header from "components/Headers/Header.js";
import StarShipModal from "../../components/StarShip/Modal.js";

const API_URL = "https://swapi.dev/api/starships/";
const ITEMS_PER_PAGE = 10;

class StarShip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      starships: {},
      loadingData: true,
      activePageNumber: 1,
      showModal: false,
      editStarshipData: {},
    };
    this.loadStarshipData();
  }

  loadStarshipData(_apiUrl) {
    // load data from the api
    this.setState({ loadingData: true });
    fetch(_apiUrl || API_URL)
      .then((res) => res.json())
      .then(
        (result) => {
          // save a local copy of the starship data
          this.setState({ starships: result, loadingData: false });
          console.log(result);
        },
        (error) => {
          // TODO - check the error and display in UI as necessary (not implemented for now)
          this.setState({ loadingData: false });
        }
      );
  }
  render() {
    const starships =
      this.state && this.state.starships && this.state.starships.results;

    const updateStarshipData = (_starshipData) => {
      // create or update the startship data to the local copy
      if (this.state.editStarshipData) {
        // update the modified starship data
        this.setState({
          starships: {
            ...this.state.starships,
            results: this.state.starships.results.map((el) =>
              el.name === _starshipData.name ? { ...el, ..._starshipData } : el
            ),
          },
        });
      } else {
        // create new starship data and add to the top of the table
        this.setState({
          starships: {
            ...this.state.starships,
            results: [_starshipData, ...this.state.starships.results],
          },
        });
      }
      toggleModalVisiblity(null);
    };

    const toggleModalVisiblity = (_selectedStarship) => {
      // show or hide the modal
      this.setState({
        showModal: !this.state.showModal,
        editStarshipData: _selectedStarship,
      });
    };

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Modal */}
          {this.state.showModal && (
            <StarShipModal
              onCancel={toggleModalVisiblity}
              title={
                this.state.editStarshipData
                  ? "Update Starship"
                  : "Create Starship"
              }
              starShipData={this.state.editStarshipData}
              actionButton={{
                title: this.state.editStarshipData ? "Update" : "Create",
                onSubmit: updateStarshipData,
              }}
            />
          )}
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="col-md-11">Starships</h3>
                  <Button
                    className="col-md-1 float-right"
                    color="primary"
                    type="button"
                    onClick={() => toggleModalVisiblity(null)}
                  >
                    Create
                  </Button>
                </CardHeader>
                {this.state.loadingData && (
                  <div className="text-center p-3">
                    <Spinner animation="grow" />
                  </div>
                )}
                {!this.state.loadingData && starships && starships.length > 0 && (
                  <>
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Model</th>
                          <th scope="col">Created Date</th>
                          <th scope="col">Cost in Credits</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {starships &&
                          starships.map((_starship) => (
                            <tr key={_starship.name}>
                              <th scope="row">
                                <span className="mb-0 text-sm">
                                  {_starship.name}
                                </span>
                              </th>
                              <td>{_starship.model}</td>
                              <td>{moment(_starship.created).format("l")}</td>
                              <td className="text-right">
                                {_starship.cost_in_credits !== "unknown"
                                  ? "$" +
                                    _starship.cost_in_credits.replace(
                                      /(\d)(?=(\d{3})+(?!\d))/g,
                                      "$1,"
                                    ) +
                                    " USD"
                                  : "N/A"}
                              </td>
                              <td>
                                <a
                                  href="#dummy"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleModalVisiblity({
                                      ..._starship,
                                      created: moment(_starship.created).format(
                                        "l"
                                      ),
                                    });
                                  }}
                                >
                                  <i className="fas fa-edit" />
                                </a>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                    <CardFooter className="py-4">
                      <nav aria-label="...">
                        <Pagination
                          className="pagination justify-content-end mb-0"
                          listClassName="justify-content-end mb-0"
                        >
                          <PaginationItem
                            className={
                              this.state.starships.previous ? "" : "disabled"
                            }
                          >
                            <PaginationLink
                              href="#pablo"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({
                                  activePageNumber:
                                    this.state.activePageNumber - 1,
                                });
                                this.loadStarshipData(
                                  this.state.starships.previous
                                );
                              }}
                              tabIndex="-1"
                            >
                              <i className="fas fa-angle-left" />
                              <span className="sr-only">Previous</span>
                            </PaginationLink>
                          </PaginationItem>
                          {/* simple for loop to list all the pages*/}
                          {Array.from(
                            Array(
                              Math.ceil(
                                this.state.starships.count / ITEMS_PER_PAGE
                              )
                            )
                          ).map((_item, _index) => (
                            <PaginationItem
                              key={_index}
                              className={
                                this.state.activePageNumber == _index + 1
                                  ? "active"
                                  : ""
                              }
                            >
                              <PaginationLink
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    activePageNumber: _index + 1,
                                  });
                                  this.loadStarshipData(
                                    API_URL + "?page=" + (_index + 1)
                                  );
                                }}
                              >
                                {_index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem
                            className={
                              this.state.starships.next ? "" : "disabled"
                            }
                          >
                            <PaginationLink
                              href="#pablo"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({
                                  activePageNumber:
                                    this.state.activePageNumber + 1,
                                });
                                this.loadStarshipData(
                                  this.state.starships.next
                                );
                              }}
                            >
                              <i className="fas fa-angle-right" />
                              <span className="sr-only">Next</span>
                            </PaginationLink>
                          </PaginationItem>
                        </Pagination>
                      </nav>
                    </CardFooter>
                  </>
                )}
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default StarShip;
