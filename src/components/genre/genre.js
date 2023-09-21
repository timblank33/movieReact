import React, { PureComponent } from 'react';
import { SwapiServiceConsumer } from '../swapi-service-context';
export default class GenreName extends PureComponent {
  state = {
    genre: [],
  };
  render() {
    let minId = 0;
    const { id } = this.props;
    const { genre } = this.state;
    return (
      <SwapiServiceConsumer>
        {(swapiServiceGenre) => {
          swapiServiceGenre.then((arrayGenres) => {
            let arr = id.map((item) => {
              minId++;
              for (let key of arrayGenres) {
                if (item === key.id) {
                  item = key.name;
                }
              }
              return (
                <button key={minId} className="btn-genre">
                  {item}
                </button>
              );
            });

            this.setState({ genre: arr });
          });
          return <div className="genre">{genre}</div>;
        }}
      </SwapiServiceConsumer>
    );
  }
}
