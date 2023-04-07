============
ENS Document
============

.. code-block:: solidity

    interface IENS {
        function createDomain(string calldata _domain) external;

        function destroyDomain(string calldata _domain) external;

        function transferDomain(
            string calldata _domain,
            address _recepient
        ) external;
        
        function userToDomain(address _user) external view returns(string calldata);
        
        function domainToUser(string calldata _domain) external view returns(address);
        
        function isExists(string calldata _domain) external view returns(bool);
        
        function hasDomain(address _user) external view returns(bool);
        
        function domainCounter() external view returns(uint);
    }

---------------------------------------------------------------------------------

Create a domain
===============

.. code-block:: solidity
    
    function createDomain(string calldata _domain) external;

User can create a domain by calling the ``createDomain`` .

---------
Prameters
---------
1. ``_domain`` - ``string``: The domain name .

---------------------------------------------------------------------------------

Destroy a domain
================

.. code-block:: solidity
    
    function destroyDomain(string calldata _domain) external;


User can destroy his/her domain via ``destroyDomain`` .

---------
Prameters
---------
1. ``_domain`` - ``string``: The domain name .

---------------------------------------------------------------------------------

Transfer a domain
=================

.. code-block:: solidity
    
        function transferDomain(
            string calldata _domain,
            address _recepient
        ) external;


User can transfer his/her domain via calling ``transferDomain`` .

---------
Prameters
---------
1. ``_domain`` - ``string``: The domain name .
2. ``_recepient`` - ``address``: The recepient address .

---------------------------------------------------------------------------------

Find user owned domain
======================

.. code-block:: solidity
    
    function userToDomain(address _user) external view returns(string calldata);


Can get the user's domain (if exists!) by calling ``userToDomain`` .

---------
Prameters
---------
1. ``_user`` - ``address``: The user address .

-------
Returns
-------
1. ``string``: The user's domain name .

---------------------------------------------------------------------------------

Find domain's owner
======================

.. code-block:: solidity
    
    function domainToUser(string calldata _domain) external view returns(address);


Can get the domain's owner (if exists!) by calling ``domainToUser`` .

---------
Prameters
---------
1. ``_domain`` - ``string``: The domain name .

-------
Returns
-------
1. ``address``: The domain's owner address .

---------------------------------------------------------------------------------

Check domain existence
======================

.. code-block:: solidity
    
    function isExists(string calldata _domain) external view returns(bool);


If a domain has a owner it will return ``true`` otherwise ``false`` .

---------
Prameters
---------
1. ``_domain`` - ``string``: The domain' name .

-------
Returns
-------
1. ``bool``: The domain status .

---------------------------------------------------------------------------------

Check a user ownership
======================

.. code-block:: solidity
    
    function hasDomain(address _user) external view returns(bool);


If a a user has a domain it will return ``true`` otherwise ``false`` .

---------
Prameters
---------
1. ``_user`` - ``address``: The user address .

-------
Returns
-------
1. ``bool``: The user ownership status .

---------------------------------------------------------------------------------

Get total domains count
=======================

.. code-block:: solidity
    
    function domainCounter() external view returns(uint);


Calling ``domainCounter`` will returns total created domains count .

-------
Returns
-------
1. ``uint256``: Total created domain count until now .
