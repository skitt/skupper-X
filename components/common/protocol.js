/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
*/

"use strict";

const VERSION      = 1;
const OP_HEARTBEAT = 'HB';
const OP_GET       = 'GET';
const OP_CLAIM     = 'CLAIM';

exports.Heartbeat = function(fromSite, hashSet, address="") {
    return {
        version : VERSION,
        op      : OP_HEARTBEAT,
        site    : fromSite,
        hashset : hashSet,
        address : address,
    };
}

exports.GetObject = function(fromSite, objectName) {
    return {
        version    : VERSION,
        op         : OP_GET,
        site       : fromSite,
        objectname : objectName,
    };
}

exports.GetObjectResponseSuccess = function(objectName, hash, data) {
    return {
        statusCode        : 200,
        statusDescription : 'OK',
        objectName        : objectName,
        hash              : hash,
        data              : data,
    };
}

exports.AssertClaim = function(claimId, name) {
    return {
        version : VERSION,
        op      : OP_CLAIM,
        claim   : claimId,
        name    : name,
    };
}

exports.AssertClaimResponseSuccess = function(outgoingLinks, siteClient) {
    return {
        statusCode        : 200,
        statusDescription : 'OK',
        outgoingLinks     : outgoingLinks,
        siteClient        : siteClient,
    };
}

exports.ReponseFailure = function(code, description) {
    return {
        statusCode        : code,
        statusDescription : description,
    };
}

exports.DispatchMessage = function(body, onHeartbeat, onSolicit, onGet, onClaim) {
    if (body.version != VERSION) {
        throw Error(`Unsupported protocol version ${body.version}`);
    }

    switch (body.op) {
    case OP_HEARTBEAT : onHeartbeat(body.site, body.hashset, body.address);  break;
    case OP_GET       : onGet(body.site, body.objectname);                   break;
    case OP_CLAIM     : onClaim(body.claim, body.name);                      break;
    default:
        throw Error(`Unknown op-code ${body.op}`);
    }
}