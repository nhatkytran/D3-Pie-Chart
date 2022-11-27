const name = document.querySelector('#name');
const cost = document.querySelector('#cost');
const errorMessage = document.querySelector('#error');

const resetErrorMessage = () => (errorMessage.textContent = '');

name.addEventListener('input', resetErrorMessage);
cost.addEventListener('input', resetErrorMessage);

const resetForm = () => {
  name.value = '';
  cost.value = '';
  cost.select();
  name.select();
  resetErrorMessage();
};

const formControl = async (addData, event) => {
  try {
    event.preventDefault();

    if (!(name.value && cost.value)) {
      errorMessage.textContent = 'Please enter values!';
      return;
    }

    const costValue = Number(cost.value);

    if (Number.isNaN(costValue)) {
      errorMessage.textContent = "Item's cost must be a number!";
      return;
    }

    await addData({
      name: name.value,
      cost: cost.value,
    });

    resetForm();
  } catch (error) {
    const message = 'Something went wrong!';

    console.error(message);
    console.error(error);
    errorMessage.textContent = message;
  }
};

export default formControl;
