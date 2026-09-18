import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        token_key = self._get_token_from_query()
        if not token_key:
            await self.close()
            return

        try:
            token = await database_sync_to_async(
                Token.objects.select_related("user").get
            )(key=token_key)
            self.user = token.user
        except Token.DoesNotExist:
            await self.close()
            return

        self.group_name = f"user_{self.user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Called by group_send from views.py
    async def order_status_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "order_status",
            "order_id": event["order_id"],
            "status": event["status"],
            "message": event["message"],
        }))

    def _get_token_from_query(self):
        query = self.scope.get("query_string", b"").decode()
        for part in query.split("&"):
            if part.startswith("token="):
                return part.split("=", 1)[1]
        return None