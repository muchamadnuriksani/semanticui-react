import React, { Component } from 'react';
import { Icon, Label, Menu, Table, Button, Form, Input} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isSearched = (searchTerm) => (item) =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  render() {
    const { searchTerm, result } = this.state;

    if (!result) { return null; }

    return (
      <div className="App">
        <div>
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
          </Search>
        </div>
        <TableContoh
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}


const Search = ({ value, onChange, children }) =>
  <Form>
    {children} <Input icon="search" placeholder="Search..."
      type="text"
      value={value}
      onChange={onChange}
    />
  </Form>

const TableContoh = ({ list, pattern, onDismiss }) =>
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Title</Table.HeaderCell>
        <Table.HeaderCell>Author</Table.HeaderCell>
        <Table.HeaderCell>Number</Table.HeaderCell>
        <Table.HeaderCell>Number_1</Table.HeaderCell>
        <Table.HeaderCell>Button</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>    
    { list.filter(isSearched(pattern)).map(item =>
      <Table.Row>
        <Table.Cell>
          <a href={item.url}>{item.title}</a>
        </Table.Cell>
        <Table.Cell>
          {item.author}
        </Table.Cell>
        <Table.Cell>
          {item.num_comments}
        </Table.Cell>
        <Table.Cell>
          {item.points}
        </Table.Cell>
        <Table.Cell>
          <ButtonContoh
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </ButtonContoh>
        </Table.Cell>
      </Table.Row>
    )}
    </Table.Body>
    </Table>

const ButtonContoh = ({ onClick, className = '', children }) =>
  <Button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </Button>

export default App;
