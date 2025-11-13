const DataPreview = () => {
  return (
    <>
      <div className='flex mb-2'>
        <label
          htmlFor='table'
          className='flex-3 text-gray-700 font-medium mb-1'
        >
          Data Preview
        </label>
        <select name='table' id='table' className='flex-1'>
          <option value='table1'>Table 1</option>
          <option value='table2'>Table 2</option>
          <option value='table3'>Table 3</option>
        </select>
      </div>
      <table className='table-auto w-full text-left mb-2'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Name</th>
            <th scope='col'>Category</th>
            <th scope='col'>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td>Sample Data 1</td>
            <td>Category A</td>
            <td>245.50</td>
          </tr>
          <tr>
            <td>002</td>
            <td>Sample Data 2</td>
            <td>Category B</td>
            <td>127.80</td>
          </tr>
          <tr>
            <td>003</td>
            <td>Sample Data 3</td>
            <td>Category A</td>
            <td>389.20</td>
          </tr>
        </tbody>
      </table>
      <form className='flex justify-end gap-2'>
        <input
          type='text'
          placeholder='Enter quick instructions...'
          className='grow'
        />
        <button
          type='submit'
          className='px-4 py-2 bg-gray-800 text-white font-normal rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400'
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default DataPreview;
