import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  FormGroup,
} from "reactstrap";

class StarShipModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      starShipData: props.starShipData
        ? props.starShipData
        : {
            name: "",
            model: "",
            created: "",
            cost_in_credits: "",
          },
      error: {},
    };
  }

  render() {
    const updateStarShipData = (e) => {
      this.setState({
        starShipData: {
          ...this.state.starShipData,
          [e.target.name]: e.target.value,
        },
      });
    };
    const validate = () => {
      let _error = null;
      this.setState({
        error: null,
      });
      if (!this.state.starShipData.name) {
        _error = {
          ..._error,
          name: "*Name should not be empty",
        };
      }
      if (!this.state.starShipData.model) {
        _error = {
          ..._error,
          model: "*Model should not be empty",
        };
      }
      if (!this.state.starShipData.created) {
        _error = {
          ..._error,
          created: "*Created date should not be empty",
        };
      } else {
        var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/\d{4}$/;
        var result = date_regex.test(this.state.starShipData.created);
        if (!result) {
          _error = {
            ..._error,
            created: "*Created date should be in format MM/DD/YYYY",
          };
        }
      }
      if (!this.state.starShipData.cost_in_credits) {
        _error = {
          ..._error,
          cost_in_credits: "*Cost in Credits should not be empty",
        };
      }

      this.setState({
        error: _error,
      });
      return !_error;
    };

    const onSubmit = () => {
      if (validate()) {
        this.props.actionButton.onSubmit(this.state.starShipData);
        this.setState({
          starShipData: {
            name: "",
            model: "",
            created: "",
            cost_in_credits: "",
          },
        });
      }
    };

    return (
      <Modal isOpen>
        <ModalHeader>{this.props.title}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                name="name"
                readOnly={this.props.starShipData && this.props.starShipData.name}
                value={this.state.starShipData.name}
                onChange={updateStarShipData}
              />
              {this.state.error && this.state.error.name && (
                <small className="text-danger">{this.state.error.name}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="model">Model</Label>
              <Input
                name="model"
                value={this.state.starShipData.model}
                onChange={updateStarShipData}
              />
              {this.state.error && this.state.error.model && (
                <small className="text-danger">{this.state.error.model}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="created">Created</Label>
              <Input
                name="created"
                maxLength="10"
                placeholder="MM/DD/YYYY"
                value={this.state.starShipData.created}
                onChange={updateStarShipData}
              />
              {this.state.error && this.state.error.created && (
                <small className="text-danger">
                  {this.state.error.created}
                </small>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="cost_in_credits">Cost in Credits</Label>
              <Input
                name="cost_in_credits"
                value={this.state.starShipData.cost_in_credits}
                pattern="[A-Za-z]{3}"
                onChange={(e) => {
                  const re = /^\d+$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    updateStarShipData(e);
                  }
                }}
              />
              {this.state.error && this.state.error.cost_in_credits && (
                <small className="text-danger">
                  {this.state.error.cost_in_credits}
                </small>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onSubmit}>
            {this.state.actionButton.title}
          </Button>
          <Button color="secondary" onClick={this.props.onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default StarShipModal;
