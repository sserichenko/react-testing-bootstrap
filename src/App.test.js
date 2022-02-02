import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';



// HELPERS----------------------------------------------------------------

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i,
  });
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return { emailInputElement, passwordInputElement, confirmPasswordInputElement };
};

const clickOnSubmitBtn = () => {
  const submitBtnElement = screen.getByRole('button', { name: /submit/i });
  userEvent.click(submitBtnElement);
};

describe('App component', () => {

  beforeEach(() => {
    render(<App />);
  });

  test('Inputs should be initially empty', () => {
    const emailInputElement = screen.getByRole('textbox', {
      name: /email/i,
    });
    const passwordInputElement = screen.getByLabelText('Password');
    const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
    expect(emailInputElement.value).toBe('');
    expect(passwordInputElement.value).toBe('');
    expect(confirmPasswordInputElement.value).toBe('');
  });

  describe('Anable to type in', () => {
    // email ---------------------------------------------

    test('Should be able to type an email', () => {
      const { emailInputElement } = typeIntoForm({ email: 'test@gmail.com' });
      expect(emailInputElement.value).toBe('test@gmail.com');
    });

    // password ---------------------------------------------

    test('Should be able to type a password', () => {
      const { passwordInputElement } = typeIntoForm({ password: '123456' });
      expect(passwordInputElement.value).toBe('123456');
    });

    // confirm-passwords ---------------------------------------------

    test('Should be able to type a confirm-password', () => {
      const { confirmPasswordInputElement } = typeIntoForm({ confirmPassword: '123456' });
      expect(confirmPasswordInputElement.value).toBe('123456');
    });
  });

  describe('Error handling', () => {
    // Click, when email is invalid ---------------------------------------------

    test('Should show email error message on invalid email', () => {
      expect(screen.queryByText(/the email you input is invalid/i)).not.toBeInTheDocument();
      typeIntoForm({ email: 'testgmail.com' });
      clickOnSubmitBtn();
      expect(screen.queryByText(/the email you input is invalid/i)).toBeInTheDocument();
    });

    // email is valid, but password does not valid ---------------------------------------------

    test('Should show the password error if password length is less than 5 characters', () => {
      typeIntoForm({ email: 'test@gmail.com' });
      expect(
        screen.queryByText(/the password you entered should contain at least 5 characters/i),
      ).not.toBeInTheDocument();

      typeIntoForm({ password: '123' });
      clickOnSubmitBtn();
      expect(
        screen.queryByText(/the password you entered should contain at least 5 characters/i),
      ).toBeInTheDocument();
    });

    // email is valid, password is valid, but confirmed does not match the passwordInputElement

    test('Should show the confirm password error if confirmed value does not matches with previous one', () => {
      typeIntoForm({ email: 'test@gmail.com' });
      expect(
        screen.queryByText(/the password you entered should match the previous one/i),
      ).not.toBeInTheDocument();
      typeIntoForm({ password: '12345678' });
      expect(
        screen.queryByText(/the password you entered should match the previous one/i),
      ).not.toBeInTheDocument();
      typeIntoForm({ confirmPassword: '123' });
      clickOnSubmitBtn();
      expect(
        screen.queryByText(/the password you entered should match the previous one/i),
      ).toBeInTheDocument();
    });
  });

  describe('Without errors', () => {
    // MESSAGE WITHOUT errors ---------------------------------------------
    test('Should show no error message if every input is valid', () => {
      const emailErrorElement = screen.queryByText(/the email you input is invalid/i);
      const confirmPasswordErrorElement = screen.queryByText(
        /the password you entered should match the previous one/i,
      );
      const passwordErrorElement = screen.queryByText(
        /the password you entered should contain at least 5 characters/i,
      );
      typeIntoForm({ email: 'test@gmail.com' });
      expect(confirmPasswordErrorElement).not.toBeInTheDocument();
      typeIntoForm({ password: '12345678' });
      expect(confirmPasswordErrorElement).not.toBeInTheDocument();
      typeIntoForm({ confirmPassword: '12345678' });
      clickOnSubmitBtn();

      expect(emailErrorElement).not.toBeInTheDocument();
      expect(passwordErrorElement).not.toBeInTheDocument();
      expect(confirmPasswordErrorElement).not.toBeInTheDocument();
    });
  });
});
