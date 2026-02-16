import { createServer, gcpTools } from "staruml-controller-mcp-core"

export function createGcpServer() {
    return createServer("staruml-controller-gcp", "1.0.0", gcpTools)
}
