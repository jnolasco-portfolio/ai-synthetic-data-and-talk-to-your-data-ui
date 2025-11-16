const DataPreview = () => {
  return (
    <section>
      <div className='preview-selector-group'>
        <label htmlFor='table' className='block'>
          Data Preview
        </label>
        <select name='table' id='table' className='flex-1'>
          <option value='table1'>Table 1</option>
          <option value='table2'>Table 2</option>
          <option value='table3'>Table 3</option>
        </select>
      </div>
      <form>
        <input
          type='text'
          id='instructions'
          placeholder='Enter quick instructions...'
        />
        <button type='submit'>Submit</button>
      </form>
      <table>
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
    </section>
  );
};

export default DataPreview;
