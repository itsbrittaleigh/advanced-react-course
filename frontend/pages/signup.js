import styled from 'styled-components';

import SignUpComponent from '../components/SignUp';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignUp = props => (
  <Columns>
    <SignUpComponent />
    <SignUpComponent />
    <SignUpComponent />
  </Columns>
);

export default SignUp;
