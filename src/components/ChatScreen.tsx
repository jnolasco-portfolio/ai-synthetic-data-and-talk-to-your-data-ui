import { FaArrowUp } from 'react-icons/fa';

const ChatScreen = () => {
  return (
    <>
      <section className='conversation-selector'>
        <form>
          <select>
            <option>Select a conversation...</option>
            <option>Conversation 1</option>
            <option>Conversation 2</option>
          </select>
        </form>
      </section>

      <section className='history'>
        <blockquote>Who has loaned books?</blockquote>
        <code>
          SELECT DISTINCT T1.first_name, T1.last_name FROM Library_Members AS T1
          JOIN Book_Loans AS T2 ON T1.member_id = T2.member_id
        </code>

        <hr />
        <table>
          <thead>
            <tr>
              <th>first_name</th>
              <th>last_name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>Smith</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>Johnson</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className='question-form'>
        <form>
          <div className='question-group'>
            <textarea placeholder='Ask anything' maxLength={1000}></textarea>
            <button type='submit'>
              <FaArrowUp className='shrink-0' />
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default ChatScreen;
