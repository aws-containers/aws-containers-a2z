# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

FROM amazonlinux:latest AS build
WORKDIR /srv
COPY package*.json ./
RUN curl --silent --location https://rpm.nodesource.com/setup_16.x | bash - && yum -y install nodejs && yum clean all && npm cache clean -f && npm init -y && npm install


FROM amazonlinux:latest
WORKDIR /srv
RUN curl --silent --location https://rpm.nodesource.com/setup_16.x | bash - && yum -y install nodejs && yum clean all && npm cache clean -f
COPY --from=build /srv .
ADD . .
EXPOSE 3000
CMD ["node", "location.js"]
