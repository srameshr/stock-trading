const formatters = () => {
  return {
    currency(value) {
      return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    }
  }
}

export default formatters(); // Return a singleton