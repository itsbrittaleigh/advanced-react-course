import styled from 'styled-components';
import SignInComponent from '../components/SignIn';
import SignUpComponent from '../components/SignUp';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignUp = props => (
  <Columns>
    <SignUpComponent />
    <SignInComponent />
  </Columns>
);

export default SignUp;
