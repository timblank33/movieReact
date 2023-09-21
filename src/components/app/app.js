import React, { PureComponent } from 'react';
import { Pagination } from 'antd';
import './app.css';
import Search from '../search';
import Tabs from '../tabs';
import ItemList from '../item-list/item-list';
import SwapiService from '../../services/swapi-service';
import { Spin, Alert } from 'antd';
import { Offline } from 'react-detect-offline';
import { debounce } from 'lodash';
import { SwapiServiceProvider } from '../swapi-service-context';

export default class App extends PureComponent {
  state = {
    currentPage: 1,
    todoData: [],
    totalPages: '',
    loading: true,
    query: 'return',
    error: false,
    online: '',
    currentTab: '',
    guest_session: '',
    ratedArr: [],
    apiKey: '6e21df5902c4aa0c3226e6702d95575f',
  };
  swapiService = new SwapiService();
  debounceTest = debounce((val) => {
    this.updateCinema(val);
  }, 1000);
  componentDidMount() {
    this.swapiService.getGuestSession(this.state.apiKey).then((session) => {
      this.setState({ guest_session: session });
    });
    this.updateCinema(
      `https://api.themoviedb.org/3/search/movie?query=${this.state.query}&include_adult=false&language=en-US&page=1&api_key=${this.state.apiKey}`
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.query !== prevState.query ||
      this.state.currentPage !== prevState.currentPage
    ) {
      this.setState({ loading: true });
      this.debounceTest(
        `https://api.themoviedb.org/3/search/movie?query=${this.state.query}&include_adult=false&language=en-US&page=${this.state.currentPage}&api_key=${this.state.apiKey}`
      );
    }
  }

  changeRated = (idMovie, rate) => {
    this.swapiService.getResourse(
      `https://api.themoviedb.org/3/movie/${idMovie}/rating?api_key=${this.state.apiKey}&guest_session_id=${this.state.guest_session}`,
      'POST',
      `{"value":${rate}}`
    );
  };

  onError = (err) => {
    this.setState({ error: true, loading: false });
  };

  updateCinema = (url, key = 'search') => {
    this.swapiService
      .getResourse(url)
      .then((arr) => {
        this.setState({
          todoData: arr.results,
          totalPages: arr.total_results,
          loading: false,
          currentTab: key,
        });
      })
      .catch(this.onError);
  };
  changeCurrentTab = (e) => {
    if (e.key === 'search') {
      this.updateCinema(
        `https://api.themoviedb.org/3/search/movie?query=${this.state.query}&include_adult=false&language=en-US&page=1&api_key=${this.state.apiKey}`,
        e.key
      );
      this.swapiService
        .getResourse(
          `https://api.themoviedb.org/3/guest_session/${this.state.guest_session}/rated/movies?page=1&api_key=${this.state.apiKey}`
        )
        .then((arr) => {
          this.setState({
            ratedArr: arr.results,
          });
        })
        .catch(this.onError);
    } else if (e.key === 'rated') {
      this.swapiService
        .getResourse(
          `https://api.themoviedb.org/3/guest_session/${this.state.guest_session}/rated/movies?page=1&api_key=${this.state.apiKey}`
        )
        .then((arr) => {
          this.setState({
            todoData: arr.results,
            totalPages: arr.total_results,
            loading: false,
            currentTab: e.key,
            ratedArr: arr.results,
          });
        })
        .catch(this.onError);
    }
  };

  render() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    const { loading, error, currentTab } = this.state;
    const hasData = !(loading || error);

    const onChange = (e) => {
      this.setState({ loading: true, query: e.target.value });
    };
    const renderPage = (page) => {
      this.setState({ currentPage: page });
    };

    let CinemaView = ({ state }) => {
      const {
        currentPage,
        todoData,
        totalPages,
        searchValue,
        loading,
        ratedArr,
      } = state;

      return (
        <React.Fragment>
          <SwapiServiceProvider
            value={this.swapiService.getGenres(this.state.apiKey)}
          >
            <ItemList
              searchValue={searchValue}
              currentPage={currentPage}
              todoData={todoData}
              total={totalPages}
              loading={loading}
              changeRated={this.changeRated}
              ratedArr={ratedArr}
            />
          </SwapiServiceProvider>
          <Pagination
            showSizeChanger={false}
            current={currentPage}
            pageSize={20}
            total={totalPages}
            onChange={renderPage}
          />
        </React.Fragment>
      );
    };

    const errorMessage = error ? (
      <Alert message="Error. Please update Again" type="error" />
    ) : null;
    const spinner = loading ? <Spin size={'large'} /> : null;
    const content = hasData ? <CinemaView state={this.state} /> : null;
    const searchTab =
      this.state.currentTab === 'search' ? (
        <Search
          onChange={onChange}
          currentTab={currentTab}
          changeCurrentTab={this.changeCurrentTab}
        />
      ) : null;
    return (
      <div className="main">
        <div className="main-content">
          <Tabs
            currentTab={currentTab}
            changeCurrentTab={this.changeCurrentTab}
          />
          {searchTab}

          <Offline>
            <Alert message="Error network. Please update Again" type="error" />
          </Offline>
          {errorMessage}
          {spinner}
          {content}
        </div>
      </div>
    );
  }
}
