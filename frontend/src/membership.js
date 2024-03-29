import React from 'react';

function MembershipOption() {
  return (
    <div>
      <h2>Choose Your Membership</h2>
      <label>
        Regular Membership
        <input type="radio" name="membership" value="regular" />
      </label>
      <label>
        Premium Membership
        <input type="radio" name="membership" value="premium" />
      </label>
    </div>
  );
}

export default MembershipOption;
