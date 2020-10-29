import React from 'react';
import { connect } from 'react-redux';
import AddBar from '../components/AddBar';
import Editor from '../components/Editor';
import Header from '../components/Header';
import TabelaDeGastos from '../components/TabelaDeGastos';

class Carteira extends React.Component {
  render() {
    const { editor } = this.props;
    return (
      <div>
        <Header />
        {!editor && <AddBar />}
        {editor && <Editor />}
        <TabelaDeGastos />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

export default connect(mapStateToProps)(Carteira);
