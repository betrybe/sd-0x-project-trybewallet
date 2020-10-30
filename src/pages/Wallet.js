import React from 'react';
import { connect } from 'react-redux';
import { requestCurrency } from '../actions';

class Wallet extends React.Component {

  componentDidMount() {
    this.props.fetch()
  }

  render() {
    const { email } = this.props.email;
    const { fetch } = this.props
    console.log('wallet', Object.keys(this.props.wallet.currencies))
    const currencies = Object.keys(this.props.wallet.currencies)
    return (
      <div>
        <header data-testid="email-field">{email}</header>
        <div>
          <select>
            {currencies.map((i) => (
              <option>{i}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user,
  wallet: state.wallet
})

const mapDispatchToProps = (dispatch) => ({
  fetch: () => dispatch(requestCurrency())
})


export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
