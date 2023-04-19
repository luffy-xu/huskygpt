console.log('some other code...');

const Note2x1 = {
  en: () => {
    return (
      <>
        <p>
          <b>V2.1 Release Date </b>
        </p>
        <ul>
          <li>2020-11-12</li>
        </ul>
        <p>
          <b>New Features</b>
        </p>
        <ul>
          <li>
            Validation rule creation for authorized users
            <ul>
              <li>Hard rule can be created via API</li>
              <li>
                Soft rule can be created by both API and front-end product
              </li>
            </ul>
          </li>
          <li>Soft rule creation form</li>
          <li>
            Supported rule template
            <ul>
              <li>Accuracy, count consistency</li>
              <li>Uniqueness</li>
            </ul>
          </li>
          <li>
            Table data quality check result browsing and detail data quality
            check result for each rule
          </li>
          <li>
            Data Quality Check result distribution via Mattermost channel for
            rule validation
          </li>
        </ul>
      </>
    );
  },
};

console.log('some other code...');
