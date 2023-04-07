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
    }

---------------------------------------------------------------------------------

Create a domain
===============
User can create a domain by calling the ``createDomain`` .

---------
Prameters
---------
1. ``_domain`` - ``string``: The domain name .

---------------------------------------------------------------------------------

Destroy a domain
================
User can destroy his/her domain via ``destroyDomain`` .

---------
Prameters
---------
1. ``_domain`` - ``string``: The domain name .

---------------------------------------------------------------------------------

Transfer a domain
=================
User can transfer his/her domain via calling ``transferDomain`` .

---------
Prameters
---------
1. ``_domain`` - ``string``: The domain name .
2. ``_recepient`` - ``address``: The recepient address .