import React, { PureComponent } from 'react';
import './item.css';
import { format, parse } from 'date-fns';
import { Rate } from 'antd';
import GenreName from '../genre';

export default class Item extends PureComponent {
  state = {
    rate: 0,
  };
  render() {
    let {
      id,
      title,
      poster_path,
      release_date,
      overview,
      genre_ids,
      vote_average,
      changeRated,
      rating = 0,
    } = this.props;

    let changeItemRating = () => {
      let rateItem = rating;
      this.props.ratedArr.forEach((el) => {
        if (el.id === this.props.id) {
          rateItem = el.rating;
        }
      });
      return rateItem;
    };

    let borderColor = (value) => {
      if (value <= 3) {
        return '#E90000';
      } else if (value > 3 && value <= 5) {
        return '#E97E00';
      } else if (value > 5 && value <= 7) {
        return '#E9D100';
      } else {
        return '#66E900';
      }
    };
    let posterImg = (poster) => {
      if (poster === null) {
        return 'https://img.freepik.com/free-vector/oops-404-error-with-a-broken-robot-concept-illustration_114360-5529.jpg?w=2000';
      } else {
        return `https://image.tmdb.org/t/p/w500${poster}`;
      }
    };
    let dateFormat = (date) => {
      if (date === '') {
        date = 'Date not specified';
        return date;
      }
      let reDate = JSON.stringify(release_date)
        .match(/[\d-]+/)
        .join()
        .replaceAll('-', '.');
      return format(parse(reDate, 'yyyy.MM.dd', new Date()), 'MMMM d, yyyy ');
    };
    let titleFormat = (title) => {
      if (title === '') {
        return 'Title not specified';
      }

      let finalTitle = [];
      if (title.length > 60) {
        let str = overview.substr(0, 50);
        let arr = overview.split(' ');
        str.split(' ').forEach((item) => {
          if (arr.includes(item)) {
            finalTitle.push(item);
          }
        });
        return finalTitle.join(' ') + ' ...';
      }

      return title;
    };
    let maxAboutText = (overview) => {
      if (overview === '') {
        return 'Overview not specified';
      }

      let finalText = [];
      if (overview.length > 220 - title.length) {
        let str = overview.substr(0, 220 - title.length);
        let arr = overview.split(' ');
        str.split(' ').forEach((item) => {
          if (arr.includes(item)) {
            finalText.push(item);
          }
        });
        return finalText.join(' ') + ' ...';
      }

      return overview;
    };
    let genreFormat = (id) => {
      if (id.length === 0) {
        return <p className="null-genre">Genre not specified</p>;
      }
      return <GenreName id={id} />;
    };
    let changeRatedState = (value) => {
      this.setState({ rate: value });
    };

    if (vote_average === '') {
      return 0;
    }
    return (
      <div key={id} className="item">
        <img className="item-img" src={posterImg(poster_path)} alt="img"></img>
        <div className="item-text">
          <h1>{titleFormat(title)}</h1>
          <div
            className="vote-average"
            style={{
              borderColor: borderColor(this.state.rate || changeItemRating()),
            }}
          >
            {this.state.rate || changeItemRating()}
          </div>
          <Rate
            allowHalf
            allowClear={false}
            count={10}
            defaultValue={changeItemRating()}
            onChange={function (event) {
              changeRated(id, event);
              changeRatedState(event);
            }}
          />
          <p className="item-date">{dateFormat(release_date)}</p>
          {genreFormat(genre_ids)}
          <p className="item-about">{maxAboutText(overview)}</p>
        </div>
      </div>
    );
  }
}
