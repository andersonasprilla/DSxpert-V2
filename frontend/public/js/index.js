const customerForm = document.getElementById('kt_modal_add_customer_form')

customerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let tag = document.getElementById('customerName').value
    let ro = document.getElementById('repairOrder').value
    let name = document.getElementById('customerName').value
    let contact = document.getElementById('contactNumber').value
    let model = document.getElementById('model').value

    const newCustomer = {
        tag,
        ro,
        name,
        contact,
        model
    }

    fetch('api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })
      .then((res) => res.json())
      .then(() => {
        tag = '';
        ro = '';
        name = '';
        contact = '';
        model = '';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
})